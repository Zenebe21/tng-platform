'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase'; // ከ src/lib/supabase.js ፋይል ይወስዳል

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  
  // ፎርም ዳታ
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ምዝገባ (Sign Up)
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(isEnglish ? 'Passwords do not match!' : 'የይለፍ ቃላቱ አይመሳሰሉም!');
      return;
    }

    const { data, error: insertError } = await supabase
      .from('tng_members')
      .insert([
        { 
          phone_number: phone.trim(), 
          password_hash: password, 
          referral_code: referralCode || null 
        }
      ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess(isEnglish ? 'Registration successful! Please Log In.' : 'ምዝገባው ተሳክቷል! አሁን መግባት ይችላሉ።');
      setIsLogin(true);
    }
  };

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
      setError(isEnglish ? 'Invalid phone number or password!' : 'የስልክ ቁጥር ወይም ይለፍ ቃል ተሳስቷል!');
    } else {
      alert(isEnglish ? 'Login Successful!' : 'በተሳካ ሁኔታ ገብተዋል!');
      window.location.href = '/dashboard';
    }
  };

  // ይለፍ ቃል መቀየር (Forgot Password)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error: updateError } = await supabase
      .from('tng_members')
      .update({ password_hash: password })
      .eq('phone_number', phone.trim());

    if (updateError) {
      setError(updateError.message);
    } else {
      alert(isEnglish ? 'Password updated successfully!' : 'የይለፍ ቃልዎ ተቀይሯል!');
      setIsForgotPassword(false);
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center relative px-4">
      {/* 🌐 Language Switcher */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => setIsEnglish(!isEnglish)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-1 px-3 rounded-full text-sm transition"
        >
          {isEnglish ? '🇪🇹 አማርኛ' : '🇬🇧 English'}
        </button>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold text-center text-amber-500 mb-2">
          Trust New Generation (TNG)
        </h2>
        <p className="text-center text-sm text-slate-400 mb-6">
          {isEnglish ? 'Reliable and Automated ROI Platform' : 'አስተማማኝ እና አውቶማቲክ የትርፍ ማግኛ መድረክ'}
        </p>

        {isForgotPassword ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h3 className="text-lg text-center font-semibold mb-2">{isEnglish ? 'Reset Password' : 'ይለፍ ቃል ቀይር'}</h3>
            <div>
              <label className="text-sm block mb-1">{isEnglish ? 'Phone Number' : 'ስልክ ቁጥር'}</label>
              <input type="tel" placeholder="09..." className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-500" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm block mb-1">{isEnglish ? 'New Password' : 'አዲስ የይለፍ ቃል'}</label>
              <input type="password" placeholder="******" className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition">
              {isEnglish ? 'Update Password' : 'አድስ'}
            </button>
            <div className="text-center mt-4">
              <button type="button" onClick={() => { setIsForgotPassword(false); setIsLogin(true); }} className="text-sm text-slate-400 hover:underline">
                {isEnglish ? 'Back to Login' : 'ወደ መግቢያ ተመለስ'}
              </button>
            </div>
          </form>
        ) : isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm block mb-1">{isEnglish ? 'Phone Number' : 'ስልክ ቁጥር'}</label>
              <input type="tel" placeholder="09..." className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-500" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm block mb-1">{isEnglish ? 'Password' : 'የይለፍ ቃል'}</label>
              <input type="password" placeholder="******" className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition">
              {isEnglish ? 'Log In' : 'ግባ'}
            </button>
            <div className="flex justify-between items-center mt-4 text-sm">
              <button type="button" onClick={() => setIsForgotPassword(true)} className="text-amber-400 hover:underline">
                {isEnglish ? 'Forgot Password?' : 'የይለፍ ቃል ረስተዋል?'}
              </button>
              <button type="button" onClick={() => setIsLogin(false)} className="text-slate-400 hover:underline">
                {isEnglish ? 'Sign Up' : 'ተመዝገብ (+)'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm block mb-1">{isEnglish ? 'Phone Number' : 'ስልክ ቁጥር'}</label>
              <input type="tel" placeholder="09..." className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-500" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm block mb-1">{isEnglish ? 'Password' : 'የይለፍ ቃል'}</label>
              <input type="password" placeholder="******" className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm block mb-1">{isEnglish ? 'Confirm Password' : 'የይለፍ ቃል አረጋግጥ'}</label>
              <input type="password" placeholder="******" className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-500" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm block mb-1">{isEnglish ? 'Referral Code (Optional)' : 'የሪፈራል ኮድ (ከተፈለገ)'}</label>
              <input type="text" placeholder="TNG..." className="w-full p-3 rounded-xl bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-500" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
            </div>
            <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition">
              {isEnglish ? 'Register' : 'ተመዝገብ'}
            </button>
            <div className="text-center mt-4">
              <button type="button" onClick={() => setIsLogin(true)} className="text-sm text-slate-400 hover:underline">
                {isEnglish ? 'Already have an account? Log In' : 'አካውንት አለዎት? ይግቡ'}
              </button>
            </div>
          </form>
        )}

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-4 text-center">{success}</p>}
      </div>
    </div>
  );
}
