'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';

export default function TeamPage() {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('referral_code')
            .eq('id', user.id)
            .single();
          if (data) setReferralCode(data.referral_code);
        }
      } catch (err) {
        console.error(err);
      }
    }
    getProfile();
  }, []);

  const copyLink = () => {
    if (typeof window !== 'undefined' && referralCode) {
      const link = `${window.location.origin}/register?ref=${referralCode}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/5">
           <span className="text-3xl text-amber-400">🔗</span>
        </div>
        <h2 className="text-2xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">ጓደኞችህን ይጋብዙ</h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">የግብዣ ሊንክህን ለሰዎች በማጋራት የ 3 ደረጃ ኮሚሽን (10% / 7% / 2%) ያግኙ! አሁኑኑ ያጋሩ።</p>
        
        <button 
          onClick={copyLink}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold transition shadow-md shadow-amber-500/10"
        >
          {copied ? 'ኮፒ ሆኗል! ✅' : 'የግብዣ ሊንክ ኮፒ አድርግ'}
        </button>
      </div>
    </div>
  );
}
