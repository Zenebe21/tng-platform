'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function VIPPage() {
  const [vipLevels, setVipLevels] = useState([]);
  const [currentVip, setCurrentVip] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVIPData();
  }, []);

  async function fetchVIPData() {
    try {
      // Fetch VIP Levels
      const { data: levelsData, error: levelsError } = await supabase
        .from('vip_levels')
        .select('*')
        .order('level', { ascending: true });

      if (levelsError) {
        console.error(levelsError);
      } else {
        setVipLevels(levelsData || []);
      }

      // Fetch Logged User
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('vip_level')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error(profileError);
        } else {
          setCurrentVip(profileData?.vip_level || 0);
        }
      }
    } catch (error) {
      console.error('VIP Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBuyVIP(vip) {
    alert(`${vip.name} ለመግዛት backend logic ያስፈልጋል`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p className="text-lg font-semibold">በመጫን ላይ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-amber-400 mb-8">
          TNG VIP Center
        </h1>

        <div className="space-y-5">
          {vipLevels.map((tier) => (
            <div
              key={tier.level}
              className={`rounded-3xl p-5 border transition-all ${
                currentVip === tier.level
                  ? 'border-amber-400 bg-slate-900'
                  : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-amber-400">
                    {tier.name}
                  </h2>

                  <p className="text-slate-300 mt-1">
                    ዋጋ፦{' '}
                    <span className="font-bold">
                      {Number(tier.price).toFixed(2)} ETB
                    </span>
                  </p>

                  <p className="text-emerald-400 font-bold mt-1">
                    የቀን ገቢ፦{' '}
                    {Number(tier.daily_return).toFixed(2)} ETB
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    የVIP ዕድሜ፦ 365 ቀናት
                  </p>
                </div>

                {currentVip === tier.level ? (
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-2 rounded-xl text-xs font-bold">
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuyVIP(tier)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-5 py-2 rounded-xl transition-all"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
                          }
