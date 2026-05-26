'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function FinancePage() {
  const [isAmharic, setIsAmharic] = useState(true);
  const [activeTab, setActiveTab] = useState('deposit'); // deposit ወይም withdraw
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Telebirr');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const text = {
    en: {
      title: 'Financial Center',
      balance: 'Available Balance',
      deposit: 'Deposit Money',
      withdraw: 'Withdraw Money',
      amount: 'Amount (ETB)',
      method: 'Payment Method',
      accNo: 'Account / Phone Number',
      minWithdraw: 'Minimum withdrawal is 300 ETB with a 10% fee.',
      lowBalance: 'Insufficient balance to withdraw!',
      successW: 'Withdrawal request submitted! It will be processed soon.',
      successD: 'Deposit instructions sent! Please complete the payment.',
      submit: 'Submit Request'
    },
    am: {
      title: 'የገንዘብ ማዕከል',
      balance: 'ያለዎት ቀሪ ገንዘብ',
      deposit: 'ገንዘብ ማስገቢያ (Deposit)',
      withdraw: 'ገንዘብ ማውጫ (Withdraw)',
      amount: 'የገንዘብ መጠን (ETB)',
      method: 'የክፍያ መንገድ',
      accNo: 'የአካውንት / የስልክ ቁጥር',
      minWithdraw: 'አነስተኛው ማውጫ 300 ETB ሲሆን የ10% አገልግሎት ክፍያ አለው።',
      lowBalance: 'ለማውጣት በቂ ቀሪ ገንዘብ የለዎትም!',
      successW: 'የማውጫ ጥያቄዎ ገብቷል! በቅርቡ ይተላለፍልዎታል።',
      successD: 'የማስገቢያ መመሪያው ተልኳል! እባክዎ ክፍያውን ያጠናቁ።',
      submit: 'ጥያቄውን ላክ'
    }
  };

  const t = isAmharic ? text.am : text.en;

  useEffect(() => {
    async function fetchFinanceData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/';
        return;
      }
      setUser(user);

      let { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();
      
      if (profile) setBalance(profile.balance);
    }
    fetchFinanceData();
  }, []);

  const handleTransaction = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      alert('እባክዎ ትክክለኛ የገንዘብ መጠን ያስገቡ');
      return;
    }

    setLoading(true);

    if (activeTab === 'withdraw') {
      // 300 ETB ሚኒመም ዊዝድሮው ቼክ ማድረግ
      if (numAmount < 300) {
        alert(isAmharic ? 'ትንሹ የዊዝድሮው መጠን 300 ETB ነው!' : 'Minimum withdrawal is 300 ETB!');
        setLoading(false);
        return;
      }
      if (balance < numAmount) {
        alert(t.lowBalance);
        setLoading(false);
        return;
      }

      // የማውጫ ጥያቄን በዳታቤዝ 'transactions' ቴብል ውስጥ ማስቀመጥ
      const { error } = await supabase
        .from('transactions')
        .insert([{ 
          user_id: user.id, 
          type: 'withdrawal', 
          amount: numAmount, 
          method, 
          account_info: accountNumber, 
          status: 'pending' 
        }]);

      if (error) {
        alert(error.message);
      } else {
        // ከባላንሱ ላይ የተጠየቀውን ብር መቀነስ
        await supabase
          .from('profiles')
          .update({ balance: balance - numAmount })
          .eq('id', user.id);
        
        alert(t.successW);
        setBalance(balance - numAmount);
        setAmount('');
        setAccountNumber('');
      }
    } else {
      // የዲፖዚት ጥያቄ መመዝገብ
      const { error } = await supabase
        .from('transactions')
        .insert([{ 
          user_id: user.id, 
          type: 'deposit', 
          amount: numAmount, 
          method, 
          account_info: accountNumber, 
          status: 'pending' 
        }]);

      if (error) {
        alert(error.message);
      } else {
        alert(t.successD);
        setAmount('');
        setAccountNumber('');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-tngDark text-white p-4 pb-24">
      {/* ራስጌ */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-black text-tngGold">{t.title}</h1>
        </div>
        <button 
          onClick={() => setIsAmharic(!isAmharic)}
          className="bg-tngCard border border-gray-700 px-3 py-1 rounded-full text-xs text-tngGold"
        >
          {isAmharic ? 'English' : 'አማርኛ'}
        </button>
      </div>

      {/* ባላንስ ማሳያ */}
      <div className="bg-tngCard p-4 rounded-xl border border-gray-800 text-center mb-6">
        <p className="text-gray-400 text-xs">{t.balance}</p>
        <h2 className="text-2xl font-bold text-tngGold mt-1">{balance.toFixed(2)} ETB</h2>
      </div>

      {/* ታቦችን መቀየሪያ (Deposit / Withdraw) */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-tngCard rounded-xl border border-gray-800 mb-6">
        <button 
          onClick={() => setActiveTab('deposit')}
          className={`py-2 rounded-lg font-bold text-sm ${activeTab === 'deposit' ? 'bg-tngGold text-tngDark' : 'text-gray-400'}`}
        >
          {isAmharic ? 'ገንዘብ ማስገቢያ' : 'Deposit'}
        </button>
        <button 
          onClick={() => setActiveTab('withdraw')}
          className={`py-2 rounded-lg font-bold text-sm ${activeTab === 'withdraw' ? 'bg-tngGold text-tngDark' : 'text-gray-400'}`}
        >
          {isAmharic ? 'ገንዘብ ማውጫ' : 'Withdraw'}
        </button>
      </div>

      {/* ፎርም */}
      <form onSubmit={handleTransaction} className="space-y-4 tng-glass p-5 rounded-2xl">
        {activeTab === 'withdraw' && (
          <p className="text-xs text-amber-400 font-medium">{t.minWithdraw}</p>
        )}

        <div>
          <label className="text-xs text-gray-400 block mb-1">{t.amount}</label>
          <input 
            type="number" required value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-xl bg-tngDark border border-gray-700 focus:border-tngGold focus:outline-none text-white text-sm"
            placeholder="e.g. 500"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">{t.method}</label>
          <select 
            value={method} onChange={(e) => setMethod(e.target.value)}
            className="w-full p-3 rounded-xl bg-tngDark border border-gray-700 focus:border-tngGold focus:outline-none text-white text-sm"
          >
            <option value="Telebirr">Telebirr (ቴሌብር)</option>
            <option value="M-Pesa">M-Pesa (ኤምፒሳ)</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">{t.accNo}</label>
          <input 
            type="text" required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full p-3 rounded-xl bg-tngDark border border-gray-700 focus:border-tngGold focus:outline-none text-white text-sm"
            placeholder="09..."
          />
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 rounded-xl btn-gold font-bold text-sm mt-4">
          {loading ? '...' : t.submit}
        </button>
      </form>

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
        <a href="/dashboard/finance" className="flex flex-col items-center text-tngGold text-xs">
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
