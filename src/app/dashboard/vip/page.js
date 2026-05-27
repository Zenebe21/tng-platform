'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function VipPage() {
  const [vipData, setVipData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('vip_members').select('*');
      if (error) {
        console.error('Error fetching VIP data:', error);
      } else {
        setVipData(data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">የVIP አባላት</h1>
      <ul>
        {vipData.map((item) => (
          <li key={item.id} className="p-2 border-b border-slate-700">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
