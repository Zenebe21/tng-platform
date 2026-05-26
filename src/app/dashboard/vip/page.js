'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../supabaseClient';

export default function VIPPage() {
  const [vipLevels, setVipLevels] = useState([]);
  const [currentVip, setCurrentVip] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: levelsData } = await supabase
          .from('vip_levels')
          .select('*')
          .order('level', { ascending: true });
        
        if (levelsData) setVipLevels(levelsData);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('vip_level')
            .eq('id', user.id)
            .single();
          
          if (profileData) setCurrentVip(profileData.vip_level);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">በመጫን ላይ...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white">
      <h1 className="text-2xl font-bold mb-6 text-center text-amber-400">የ TNG VIP ደረጃዎች</h1>
      <div className="grid gap-4">
        {vipLevels.map((tier) => (
          <div key={tier.level} className={`p-4 rounded-xl border ${currentVip === tier.level ? 'border-amber-400 bg-slate-900' : 'border-slate-800 bg-slate-900/50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-amber-400">{tier.name}</h3>
                <p className="text-sm text-slate-400">ዋጋ፦ {tier.price} ETB</p>
                <p className="text-sm text-emerald-400">የቀን ገቢ፦ {tier.daily_return} ETB</p>
              </div>
              {currentVip === tier.level ? (
                <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-bold">ያለህበት ደረጃ</span>
              ) : (
                <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg text-sm font-bold">አንቃ</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
