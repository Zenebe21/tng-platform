'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthPage() {
  const [isAmharic, setIsAmharic] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const text = {
    en: {
      title: 'Trust New Generation (TNG)',
      subtitle: 'Smart ROI & Automated Investment Platform',
      login: 'Sign In',
      signup: 'Sign Up',
      email: 'Email Address',
      password: 'Password',
      phone: 'Phone Number (Telebirr/M-Pesa)',
      ref: 'Referral Code (Optional)',
      noAccount: "Don't have an account? ",
      haveAccount: 'Already have an account? ',
      successReg: 'Registration successful! Please log in.',
    },
    am: {
      title: 'ትረስት ኒው ጄኔሬሽን (TNG)',
      subtitle: 'አስተማማኝ እና አውቶማቲክ የትርፍ ማግኛ መድረክ',
      login: 'ግባ (Log In)',
      signup: 'ተመዝገብ (Sign Up)',
      email: 'ኢሜይል አድራሻ',
      password: 'የይለፍ ቃል',
      phone: 'የስልክ ቁጥር (ቴሌብር/ኤምፒሳ)',
      ref: 'የሪፈራል ኮድ (ካለዎት)',
      noAccount: 'አካውንት የለዎትም? ',
      haveAccount: 'አካውንት አለዎት? ',
      successReg: 'ምዝገባው ተሳክቷል! አሁን መግባት ይችላሉ።',
    }
  };

  const t = isAmharic ? text.am : text.en;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { phone, referral_by: referralCode || null }
          }
        });
        if (error) throw error;
        setMessage(t.successReg);
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/dashboard';
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-tngDark">
      {/* የቋንቋ መቀየሪያ ቁልፍ (እዚህ ላይ ተስተካክሏል) */}
      <button 
        onClick={() => setIsAmharic(!isAmharic)}
        className="absolute top-4 right-4 bg-tngCard border border-gray-700 px-4 py-2 rounded-full text-sm font-semibold text-tngGold"
      >
        {isAmharic ? 'English' : 'አማርኛ'}
      </button>

      <div className="w-full max-w-md p-8 rounded-2xl tng-glass shadow-2xl text-center z-10">
        <h1 className="text-3xl font-extrabold text-tngGold mb-2 tracking-wide">{t.title}</h1>
        <p className="text-gray-400 text-sm mb-8">{t.subtitle}</p>

        {message && (
          <div className="p-3 mb-4 rounded-lg text-sm bg-blue-900/30 text-blue-300 border border-blue-800">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4 text-left">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{t.email}</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-tngDark border border-gray-700 focus:border-tngGold focus:outline-none text-white"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{t.password}</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-tngDark border border-gray-700 focus:border-tngGold focus:outline-none text-white"
            />
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{t.phone}</label>
                <input 
                  type="text" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-tngDark border border-gray-700 focus:border-tngGold focus:outline-none text-white"
                  placeholder="09..."
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{t.ref}</label>
                <input 
                  type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full p-3 rounded-xl bg-tngDark border border-gray-700 focus:border-tngGold focus:outline-none text-white"
                />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="w-full p-4 rounded-xl btn-gold mt-4">
            {loading ? '...' : (isSignUp ? t.signup : t.login)}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6">
          {isSignUp ? t.haveAccount : t.noAccount}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-tngGold font-bold hover:underline">
            {isSignUp ? t.login : t.signup}
          </button>
        </p>
      </div>
    </div>
  );
}
