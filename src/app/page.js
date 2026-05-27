'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase'; // ይህ መንገድ ፋይልህን በትክክል ያገናኛል

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // መግቢያ (Log In)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error: loginError } = await supabase
      .from('tng_members')
      .select('*')
      .eq('phone_number', phone.trim())
      .single();

    if (loginError || !data || data.password_hash !== password) {
      setError('የስልክ ቁጥር ወይም ይለፍ ቃል ተሳስቷል!');
    } else {
      alert('በተሳካ ሁኔታ ገብተዋል!');
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold text-center text-amber-500 mb-6">
          Trust New Generation (TNG)
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm block mb-1">ስልክ ቁጥር</label>
            <input 
              type="tel" 
              className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 focus:border-amber-500 outline-none" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="text-sm block mb-1">የይለፍ ቃል</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 focus:border-amber-500 outline-none" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition">
            ግባ
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
