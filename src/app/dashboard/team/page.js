'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function TeamPage() {
  const [isAmharic, setIsAmharic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState({ level1: [], level2: [], level3: [] });
  const [totalCommission, setTotalCommission] = useState(0);

  const text = {
    en: {
      title: 'My Referral Team',
      subtitle: 'Track your network and earnings from 3 levels of referrals',
      totalComm: 'Total Commission Earned',
      level1: 'Level 1 (10% Commission)',
      level2: 'Level 2 (7% Commission)',
      level3: 'Level 3 (2% Commission)',
      noMembers: 'No members in this level yet.',
      memberId: 'User ID',
      joined: 'Joined Date'
    },
    am: {
      title: 'የእኔ የሪፈራል ቡድን',
      subtitle: 'በ3 የሪፈራል ደረጃዎች የጋበዟቸውን ሰዎች እና ያገኙትን ገቢ ይከታተሉ',
      totalComm: 'አጠቃላይ ያገኙት ኮሚሽን',
      level1: 'ደረጃ 1 (10% ኮሚሽን)',
      level2: 'ደረጃ 2 (7% ኮሚሽን)',
      level3: 'ደረጃ 3 (2% ኮሚሽን)',
      noMembers: 'በዚህ ደረጃ እስካሁን ምንም አባል የለም።',
      memberId: 'የአባል መለያ (ID)',
      joined: 'የተቀላቀሉበት ቀን'
    }
  };

  const t = isAmharic ? text.am : text.en;

  useEffect(() => {
    async function fetchTeamData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/';
        return;
      }

      // እዚህ ላይ ከተጠቃሚው ፕሮፋይል ላይ የሪፈራል መረጃዎችን እናመጣለን
      // (ለጊዜው ለዲዛይኑ ማሳያ የሚሆን ባዶ ዝርዝር ይይዛል፣ ዳታቤዙ ሲሞላ ራሱ ያነበዋል)
      setLoading(false);
    }
    fetchTeamData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-tngDark text-white">Loading Team Data...</div>;

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

      {/* አጠቃላይ የኮሚሽን ካርድ */}
      <div className="bg-tngCard p-5 rounded-xl border border-gray-800 text-center mb-6">
        <p className="text-gray-400 text-xs">{t.totalComm}</p>
        <h2 className="text-2xl font-black text-emerald-400 mt-1">{totalCommission.toFixed(2)} ETB</h2>
      </div>

      {/* የሪፈራል ደረጃዎች ዝርዝር */}
      <div className="space-y-6">
        {/* Level 1 */}
        <div className="tng-glass p-4 rounded-2xl">
          <h3 className="text-sm font-bold text-tngGold mb-3">📍 {t.level1}</h3>
          {teamData.level1.length === 0 ? (
            <p className="text-xs text-gray-500 italic">{t.noMembers}</p>
          ) : (
            <div className="space-y-2">
              {/* አባላት ሲኖሩ እዚህ ውስጥ በሊስት ይወጣሉ */}
            </div>
          )}
        </div>

        {/* Level 2 */}
        <div className="tng-glass p-4 rounded-2xl">
          <h3 className="text-sm font-bold text-tngGold mb-3">📍 {t.level2}</h3>
          {teamData.level2.length === 0 ? (
            <p className="text-xs text-gray-500 italic">{t.noMembers}</p>
          ) : (
            <div className="space-y-2"></div>
          )}
        </div>

        {/* Level 3 */}
        <div className="tng-glass p-4 rounded-2xl">
          <h3 className="text-sm font-bold text-tngGold mb-3">📍 {t.level3}</h3>
          {teamData.level3.length === 0 ? (
            <p className="text-xs text-gray-500 italic">{t.noMembers}</p>
          ) : (
            <div className="space-y-2"></div>
          )}
        </div>
      </div>

      {/* የታችኛው ማውጫ */}
      <div className="fixed bottom-0 left-0 right-0 bg-tngCard/90 backdrop-blur-md border-t border-gray-800 p-2 flex justify-around items-center z-50">
        <a href="/dashboard" className="flex flex-col items-center text-gray-400 text-xs hover:text-tngGold">
          <span>🏠</span>
          <span className="mt-1">Home</span>
        </a>
        <a href="/dashboard/vip" className="flex flex-col items-center text-gray-400 text-xs hover:text-tngGold">
          <span>👑</span>
          <span className="mt-1">VIP</span>
        </a>
        <a href="/dashboard/finance" className="flex flex-col items-center text-gray-400 text-xs hover:text-tngGold">
          <span>💰</span>
          <span className="mt-1">Finance</span>
        </a>
        <a href="/dashboard/team" className="flex flex-col items-center text-tngGold text-xs">
          <span>👥</span>
          <span className="mt-1">Team</span>
        </a>
      </div>
    </div>
  );
}
