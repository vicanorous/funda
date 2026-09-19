import React, { useState } from 'react';
import { NIGERIAN_BANKS, PollarRampService } from '../../lib/pollar/ramp';
import { NigerianBank, PersonalWalletState } from '../../types';

interface CashOutViewProps {
  walletState?: PersonalWalletState;
  onBack: () => void;
  onSuccess: (amount: number, bankRef: string, currency: 'USD' | 'NGN', fee?: number) => void;
}

export const CashOutView: React.FC<CashOutViewProps> = ({ walletState, onBack, onSuccess }) => {
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('NGN');
  const [amount, setAmount] = useState('');
  const [selectedBankCode, setSelectedBankCode] = useState('058'); // GTBank
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [route, setRoute] = useState<'instant' | 'standard'>('instant');
  const [isProcessing, setIsProcessing] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const availableNgn = walletState?.holdings.ngn ?? 0;
  const availableUsd = walletState?.holdings.usd ?? 0;
  const currentAvailable = currency === 'NGN' ? availableNgn : availableUsd;

  const fee =
    currency === 'NGN'
      ? route === 'instant'
        ? 100.0 // ₦100 NIBSS instant fee
        : 0.0
      : route === 'instant'
      ? 15.0
      : 5.0;

  const netAmount = Math.max(numAmount - fee, 0);

  const selectedBank =
    NIGERIAN_BANKS.find((b: NigerianBank) => b.code === selectedBankCode) || NIGERIAN_BANKS[0];

  const handleNubanChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(cleaned);
    if (cleaned.length === 10) {
      setAccountName('VICTOR NWOGUJI');
    }
  };

  const handleAuthorize = () => {
    if (numAmount <= 0 || numAmount > currentAvailable) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const bankRef =
        currency === 'NGN'
          ? `${selectedBank.name} •••• ${accountNumber.slice(-4)}`
          : 'GTBank Domiciliary USD •••• 4812';
      onSuccess(numAmount, bankRef, currency, fee);
    }, 1400);
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Source Wallet Card */}
      <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-[#e5eeff]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#e5eeff] text-[#004ac6] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
          </div>
          <div>
            <span className="text-[11px] text-[#737686] font-medium uppercase tracking-wider block">
              Withdraw From Treasury
            </span>
            <span className="font-bold text-[14px] text-[#0b1c30]">
              Personal {currency} Treasury
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#737686] block">Available</span>
          <span className="font-mono text-[13px] font-bold text-[#006242]">
            {currency === 'NGN'
              ? `₦${availableNgn.toLocaleString()}`
              : `$${availableUsd.toLocaleString()} USD`}
          </span>
        </div>
      </div>

      {/* Currency & Amount Input Module */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#737686] uppercase tracking-wider">
            Transfer Amount
          </span>
          <div className="flex items-center bg-[#eff4ff] p-0.5 rounded-xl border border-[#dce9ff]">
            <button
              type="button"
              onClick={() => {
                setCurrency('NGN');
                setAmount('150000.00');
              }}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                currency === 'NGN'
                  ? 'bg-[#004ac6] text-white shadow-2xs'
                  : 'text-[#434655] hover:text-[#0b1c30]'
              }`}
            >
              🇳🇬 NGN (₦)
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrency('USD');
                setAmount('1000.00');
              }}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-[#004ac6] text-white shadow-2xs'
                  : 'text-[#434655] hover:text-[#0b1c30]'
              }`}
            >
              🇺🇸 USD ($)
            </button>
          </div>
        </div>

        <div className="flex items-center border-b-2 border-[#004ac6] pb-2">
          <span className="text-[28px] font-bold text-[#434655] mr-1">
            {currency === 'NGN' ? '₦' : '$'}
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-[30px] font-['Plus_Jakarta_Sans'] font-extrabold text-[#0b1c30] outline-none bg-transparent"
            placeholder="0.00"
          />
          <span className="text-[14px] font-bold text-[#434655] uppercase">{currency}</span>
        </div>

        {/* Quick Amount Presets */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {(currency === 'NGN'
            ? ['50000', '150000', '500000', '1000000']
            : ['500', '1000', '2500', '5000']
          ).map((val) => (
            <button
              key={val}
              onClick={() => setAmount(`${val}.00`)}
              className="py-1.5 px-2 rounded-xl text-[11px] font-bold bg-[#eff4ff] text-[#434655] hover:bg-[#e5eeff] transition-all cursor-pointer"
            >
              {currency === 'NGN' ? `+₦${parseInt(val).toLocaleString()}` : `+$${parseInt(val).toLocaleString()}`}
            </button>
          ))}
        </div>
      </div>

      {/* Payout Destination (Nigerian Commercial Banks / NIBSS NIP) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#eff4ff]">
          <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#0b1c30]">
            {currency === 'NGN' ? 'Destination Nigerian Bank (NUBAN)' : 'USD Domiciliary Bank Account'}
          </span>
          <span className="text-[10px] font-bold text-[#006242] bg-[#6ffbbe]/30 px-2 py-0.5 rounded-full">
            NIBSS Fast Payout
          </span>
        </div>

        {currency === 'NGN' ? (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block mb-1">
                Select Bank
              </label>
              <select
                value={selectedBankCode}
                onChange={(e) => setSelectedBankCode(e.target.value)}
                className="w-full p-2.5 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl text-[13px] font-bold text-[#0b1c30] outline-none"
              >
                {NIGERIAN_BANKS.map((b: NigerianBank) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block mb-1">
                10-Digit NUBAN Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => handleNubanChange(e.target.value)}
                maxLength={10}
                placeholder="e.g. 0124892011"
                className="w-full p-2.5 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-mono text-[15px] font-bold text-[#0b1c30] outline-none"
              />
            </div>

            {/* Resolved Beneficiary Name */}
            {accountNumber.length === 10 && (
              <div className="p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006242] text-[18px]">verified</span>
                  <div>
                    <span className="text-[10px] text-[#737686] block">Verified Account Name</span>
                    <span className="font-bold text-[13px] text-[#0b1c30]">{accountName}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#004ac6] bg-white px-2 py-0.5 rounded-full shadow-2xs">
                  {selectedBank.name}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] space-y-1">
            <div className="flex justify-between items-center text-[13px] font-bold text-[#0b1c30]">
              <span>Guaranty Trust Bank (GTBank) Domiciliary</span>
              <span className="text-[#006242]">Verified</span>
            </div>
            <p className="text-[12px] text-[#434655]">
              Account: 014****812 • Victor Nwoguji • SWIFT: GTBINGLA
            </p>
          </div>
        )}
      </div>

      {/* Speed / Rails Selection */}
      <div className="space-y-2">
        <span className="text-[12px] font-bold text-[#737686] uppercase tracking-wider block">
          Payout Speed &amp; Fee
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRoute('instant')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              route === 'instant'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-bold text-[#0b1c30]">Instant NIP</span>
              <span className="text-[11px] font-bold text-[#004ac6]">
                {currency === 'NGN' ? '₦100' : '$15'}
              </span>
            </div>
            <span className="text-[10px] text-[#737686]">Dispatched in ~2 minutes</span>
          </button>

          <button
            type="button"
            onClick={() => setRoute('standard')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              route === 'standard'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-bold text-[#0b1c30]">Standard</span>
              <span className="text-[11px] font-bold text-[#006242]">Free</span>
            </div>
            <span className="text-[10px] text-[#737686]">End of day clearing</span>
          </button>
        </div>
      </div>

      {/* Net Summary Breakdown */}
      <div className="bg-[#f8f9ff] rounded-xl p-3 border border-[#e5eeff] space-y-1.5 text-[12px]">
        <div className="flex justify-between text-[#434655]">
          <span>Gross Payout:</span>
          <span className="font-mono text-[#0b1c30]">
            {currency === 'NGN' ? `₦${numAmount.toLocaleString()}` : `$${numAmount.toLocaleString()}`}
          </span>
        </div>
        <div className="flex justify-between text-[#434655]">
          <span>Rail Processing Fee:</span>
          <span className="font-mono text-[#004ac6]">
            {currency === 'NGN' ? `₦${fee}` : `$${fee}`}
          </span>
        </div>
        <div className="flex justify-between text-[#0b1c30] font-bold pt-1 border-t border-[#eff4ff]">
          <span>Net Disbursed to Bank:</span>
          <span className="font-mono text-[14px] text-[#006242]">
            {currency === 'NGN' ? `₦${netAmount.toLocaleString()}` : `$${netAmount.toLocaleString()} USD`}
          </span>
        </div>
      </div>

      {/* Authorize Button */}
      <button
        onClick={handleAuthorize}
        disabled={isProcessing || numAmount <= 0 || numAmount > currentAvailable}
        className="w-full py-3.5 px-4 bg-[#004ac6] text-white rounded-xl font-bold text-[15px] shadow-md hover:bg-[#2563eb] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Dispatched to NIBSS Switch...</span>
          </>
        ) : numAmount > currentAvailable ? (
          <span>Insufficient {currency} Balance</span>
        ) : (
          <>
            <span>
              Disburse {currency === 'NGN' ? `₦${netAmount.toLocaleString()}` : `$${netAmount.toLocaleString()}`}
            </span>
            <span className="material-symbols-outlined text-[18px]">send</span>
          </>
        )}
      </button>
    </div>
  );
};
