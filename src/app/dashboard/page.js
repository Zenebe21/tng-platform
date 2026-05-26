'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function DashboardHome() {
  const [isAmharic, setIsAmharic] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ balance: 0, daily_earning: 0, vip_level: 0, total_deposit: 0, total_withdrawal: 0, referral_code: '' });
  const [loading, setLoading] = useState(true);

  const text = {
    en: {
      welcome: 'Welcome Back!',
      balance: 'Available Balance',
      daily: 'Today\'s Earning',
      vip: 'VIP Level',
      deposit: 'Total Deposit',
      withdraw: 'Total Withdraw',
      refLink: 'Your Referral Link',
      copy: 'Copy',
      copied: 'Copied!',
      navVip: 'VIP Tiers',
      navFinance: 'Finance',
      navTeam: 'My Team',
      logout: 'Log Out'
    },
    am: {
      welcome: 'እንኳን ደህና መጡ!',
      balance: 'ያለዎት ቀሪ ገንዘብ',
      daily: 'የዛሬ ገቢ',
      vip: 'የቪአይፒ ደረጃ',
      deposit: 'አጠቃላይ ገቢ የተደረገ',
      withdraw: 'አጠቃላይ የወጣ ገንዘብ',
      refLink: 'የእርስዎ የሪፈራል ሊንክ',
      copy: 'ኮፒ አድርግ',
      copied: 'ኮፒ ተደርጓል!',
      navVip: 'የቪአይፒ ደረጃዎች',
      navFinance: 'የገንዘብ ዝውውር',
      navTeam: 'የእኔ ቡድን',
      logout: 'ውጣ (Log Out)'
    }
  };

  const t = isAmharic ? text.am : text.en;

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/';
        return;
      }
      setUser(user);

      // የተጠቃሚውን ፕሮፋይል መረጃ ከዳታቤዝ ማምጣት
      let { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) setProfile(profileData);
      setLoading(false);
    }
    fetchUserData();
  }, []);

  const copyReferral = () => {
    const link = `${window.location.origin}?ref=${profile.referral_code}`;
    navigator.clipboard.writeText(link);
    alert(t.copied);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-tngDark text-white">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-tngDark text-white p-4 pb-24">
      {/* የላይኛው ባር */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-400 text-xs uppercase">{t.welcome}</p>
          <h2 className="text-lg font-bold text-tngGold">{user?.email}</h2>
        </div>
        <button 
          onClick={() => setIsAmharic(!isAmharic)}
          className="bg-tngCard border border-gray-700 px-3 py-1 rounded-full text-xs text-tngGold"
        >
          {isAmharic ? 'English' : 'አማርኛ'}
        </button>
      </div>

      {/* ዋናው የባላንስ ካርድ (Glassmorphism) */}
      <div className="tng-glass p-6 rounded-2xl mb-6 text-center shadow-lg relative overflow-hidden">
        <p className="text-gray-400 text-sm mb-1">{t.balance}</p>
        <h1 className="text-4xl font-black text-tngGold tracking-wider">{profile.balance.toFixed(2)} <span className="text-sm font-normal text-white">ETB</span></h1>
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-800">
          <div>
            <p className="text-gray-400 text-xs mb-1">{t.daily}</p>
            <p className="text-emerald-400 font-bold">+{profile.daily_earning.toFixed(2)} ETB</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">{t.vip}</p>
            <p className="text-tngGold font-bold">VIP {profile.vip_level}</p>
          </div>
        </div>
      </div>

      {/* የገንዘብ ታሪክ ማጠቃለያ ካርዶች */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-tngCard p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-xs mb-1">{t.deposit}</p>
          <p className="text-white font-bold text-sm">{profile.total_deposit} ETB</p>
        </div>
        <div className="bg-tngCard p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-xs mb-1">{t.withdraw}</p>
          <p className="text-white font-bold text-sm">{profile.total_withdrawal} ETB</p>
        </div>
      </div>

      {/* የሪፈራል ሊንክ ማጋሪያ */}
      <div className="bg-tngCard p-4 rounded-xl border border-gray-800 mb-6">
        <p className="text-gray-400 text-xs mb-2">{t.refLink}</p>
        <div className="flex gap-2">
          <input 
            type="text" readOnly value={`${window.location.origin}?ref=${profile.referral_code}`}
            className="w-full bg-tngDark p-2 rounded-lg text-xs border border-gray-700 text-gray-300 focus:outline-none"
          />
          <button onClick={copyReferral} className="bg-tngGold text-tngDark text-xs font-bold px-4 rounded-lg">
            {t.copy}
          </button>
        </div>
      </div>

      {/* የታችኛው የስተሰርያም ማውጫ (Bottom Navigation) */}
      <div className="fixed bottom-0 left-0 right-0 bg-tngCard/90 backdrop-blur-md border-t border-gray-800 p-2 flex justify-around items-center z-50">
        <a href="/dashboard" className="flex flex-col items-center text-tngGold text-xs">
          <span>🏠</span>
          <span className="mt-1">Home</span>
        </a>
        <a href="/dashboard/vip" className="flex flex-col items-center text-gray-400 text-xs hover:text-tngGold">
          <span>👑</span>
          <span className="mt-1">{t.navVip}</span>
        </a>
        <a href="/dashboard/finance" className="flex flex-col items-center text-gray-400 text-xs hover:text-tngGold">
          <span>💰</span>
          <span className="mt-1">{t.navFinance}</span>
        </a>
        <a href="/dashboard/team" className="flex flex-col items-center text-gray-400 text-xs hover:text-tngGold">
          <span>👥</span>
          <span className="mt-1">{t.navTeam}</span>
        </a>
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }} className="flex flex-col items-center text-red-400 text-xs">
          <span>🚪</span>
          <span className="mt-1">{t.logout}</span>
        </button>
      </div>
    </div>
  );
}
