'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TeamPage() {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function getProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('referral_code')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error(error);
          }

          if (data) {
            setReferralCode(data.referral_code);
          }
        }
      } catch (err) {
        console.error('Team Page Error:', err);
      }
    }

    getProfile();
  }, []);

  const copyLink = async () => {
    try {
      if (typeof window !== 'undefined' && referralCode) {
        const link = `${window.location.origin}/register?ref=${referralCode}`;

        await navigator.clipboard.writeText(link);

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Copy Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
        <h2 className="text-xl font-bold mb-4 text-amber-400">
          ጓደኞችህን ይጋብዙ
        </h2>

        <p className="text-sm text-slate-400 mb-6">
          የግብዣ ሊንክህን ለሰዎች በማጋራት የ3 ደረጃ ኮሚሽን
          (10% / 7% / 2%) ያግኙ!
        </p>

        {referralCode && (
          <div className="mb-4 p-3 rounded-xl bg-slate-800 text-sm break-all text-amber-300">
            {`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${referralCode}`}
          </div>
        )}

        <button
          onClick={copyLink}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold transition"
        >
          {copied ? 'ኮፒ ሆኗል! ✅' : 'የግብዣ ሊንክ ኮፒ አድርግ'}
        </button>
      </div>
    </div>
  );
}
