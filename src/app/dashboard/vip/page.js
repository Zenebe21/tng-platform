'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function VipPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVipMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('vip_members') // የቴብል ስምህን በዚህ አስገባ
          .select('*');
        
        if (error) throw error;
        setMembers(data);
      } catch (error) {
        console.error('መረጃ በማምጣት ላይ ስህተት ተፈጠረ:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVipMembers();
  }, []);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">የVIP አባላት</h1>
      
      {loading ? (
        <p>በመጫን ላይ...</p>
      ) : (
        <div className="grid gap-4">
          {members.map((member) => (
            <div key={member.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <h2 className="font-semibold text-lg">{member.full_name}</h2>
              <p className="text-slate-400">{member.phone_number}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
