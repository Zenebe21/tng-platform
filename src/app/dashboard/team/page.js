'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function TeamPage() {
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('team').select('*');
      if (error) {
        console.error('Error fetching team data:', error);
      } else {
        setTeamData(data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">የቡድን አባላት (Team)</h1>
      <ul>
        {teamData.map((item) => (
          <li key={item.id} className="p-2 border-b border-slate-700">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
