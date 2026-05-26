'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function VipPage() {
  const [isAmharic, setIsAmharic] = useState(true);
  const [user, setUser] = useState(null);
  const [currentVip, setCurrentVip] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // አንተ የወሰንካቸው ትክክለኛ የVIP ደረጃዎች፣ ዋጋ እና የዕለት ተዕለት ገቢ
  const vipTiers = [
    { level: 1, price: 500, daily: 45, name: 'VIP 1' },
    { level: 2, price: 1000, daily: 100, name: 'VIP 2' },
    { level: 3, price: 3000, daily: 330, name: 'VIP 3' },
    { level: 4, price: 6000, daily: 720, name: 'VIP 4' },
    { level: 5, price: 12000, daily: 1560, name: 'VIP 5' },
    { level: 6, price: 25000, daily: 3500, name: 'VIP 6' },
    { level: 7, price: 60000, daily: 9000, name: 'VIP 7' },
  ];

  const text = {
    en: {
      title: 'VIP Investment Tiers',
      subtitle: 'Upgrade your tier to unlock higher daily automated returns',
      current: 'Your Current Status',
      price: 'Price',
      daily: 'Daily Return',
      buy: 'Unlock Now',
      active: 'Active Tier',
      lowBalance: 'Insufficient balance. Please deposit first.',
      success: 'VIP Tier unlocked successfully!',
    },
    am: {
      title: 'የቪአይፒ የኢንቨስትመንት ደረጃዎች',
      subtitle: 'የበለጠ ከፍተኛ የዕለት ተዕለት አውቶማቲክ ትርፍ ለማግኘት ደረጃዎን ያሳድጉ',
      current: 'የአሁኑ የእርስዎ ደረጃ',
      price: 'ዋጋ',
      daily: 'የዕለት ተዕለት ገቢ',
      buy: 'አሁን ይግዙ (Unlock)',
      active: 'አሁን ያሉበት ደረጃ',
      lowBalance: 'በቂ ቀሪ ገንዘብ የለዎትም። እባክዎ መጀመሪያ አካውንትዎን ይሙሉ (Deposit)።',
      success: 'የቪአይፒ ደረጃው በተሳካ ሁኔታ ተከፍቷል!',
    }
  };

  const t = isAmharic ? text.am : text.en;

  useEffect(() => {
    async function fetchVipData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/';
        return;
      }
      setUser(user);

      let { data: profile } = await supabase
        .from('profiles')
        .select('vip_level, balance')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setCurrentVip(profile.vip_level);
        setBalance(profile.balance);
      }
      setLoading(false);
    }
    fetchVipData();
  }, []);

  const buyVip = async (tier) => {
    if (balance < tier.price) {
      alert(t.lowBalance);
      return;
    }

    setLoading(true);
    const newBalance = balance - tier.price;

    // በዳታቤዝ ውስጥ የቪአይፒ ደረጃውን ማሳደግ እና ገንዘብ መቀነስ
    const { error } = await supabase
      .from('profiles')
      .update({ 
        vip_level: tier.level, 
        balance: newBalance,
        daily_earning: tier.daily 
      })
      .eq('id', user.id);

    if (error) {
      alert(error.message);
    } else {
      alert(t.success);
      setCurrentVip(tier.level);
      setBalance(newBalance);
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-tngDark text-white">Loading VIP Tiers...</div>;

  return (
    <div className="min-h-screen bg-tngDark text-white p-4 pb-24">
      {/* ራስጌ */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-black text-tngGold">{t.title}</h1>
          <p className="text-gray-400 text-xs mt-1">{t.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsAmharic(!isAmharic)}
          className="bg-tngCard border border-gray-700 px-3 py-1 rounded-full text-xs text-tngGold"
        >
          {isAmharic ? 'English' : 'አማርኛ'}
        </button>
      </div>

      {/* የአሁኑ ደረጃ ማሳያ */}
      <div className="bg-tngCard p-4 rounded-xl border border-tngGold/30 mb-6 flex justify-between items-center">
        <span>{t.current}:</span>
        <span className="text-tngGold font-black text-lg">VIP {currentVip}</span>
      </div>

      {/* የVIP ካርዶች ዝርዝር */}
      <div className="space-y-4">
        {vipTiers.map((tier) => {
          const isActive = currentVip === tier.level;
          const isLocked = currentVip < tier.level;

          return (
            <div key={tier.level} className={`p-5 rounded-2xl tng-glass relative overflow-hidden ${isActive ? 'border-2 border-tngGold' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  👑 {tier.name}
                </h3>
                {isActive && (
                  <span className="bg-tngGold/20 text-tngGold border border-tngGold text-xs font-bold px-3 py-1 rounded-full">
                    {t.active}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">{t.price}</p>
                  <p className="text-white font-bold text-lg">{tier.price} ETB</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">{t.daily}</p>
                  <p className="text-emerald-400 font-bold text-lg">+{tier.daily} ETB / day</p>
                </div>
              </div>

              {isLocked && (
                <button 
                  onClick={() => buyVip(tier)}
                  className="w-full py-3 rounded-xl btn-gold text-sm"
                >
                  {t.buy}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* የታችኛው ማውጫ ሜኑ */}
      <div className="fixed bottom-0 left-0 right-0 bg-tngCard/90 backdrop-blur-md border-t border-gray-800 p-2 flex justify-around items-center z-50">
        <a href="/dashboard" className="flex flex-col items-center text-gray-400 text-xs hover:text-tngGold">
          <span>🏠</span>
          <span className="mt-1">Home</span>
        </a>
        <a href="/dashboard/vip" className="flex flex-col items-center text-tngGold text-xs">
          <span>👑</span>
          <span className="mt-1">VIP</span>
        </a>
        <a href="/dashboard/finance" className="flex flex-col items-center text-gray-400 text-xs hover:text-tngGold">
          <span>💰</span>
          <span className="mt-1">Finance</span>
        </a>
        <a href="/dashboard/team" className="flex flex-col items-center text-gray-400 text-xs hover:text-tngGold">
          <span>👥</span>
          <span className="mt-1">Team</span>
        </a>
      </div>
    </div>
  );
}
