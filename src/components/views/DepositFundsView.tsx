import React, { useState } from 'react';

interface DepositFundsViewProps {
  onBack: () => void;
  onSuccess: (amount: number) => void;
}

export const DepositFundsView: React.FC<DepositFundsViewProps> = ({ onBack, onSuccess }) => {
  const [amount, setAmount] = useState('2500.00');
  const [method, setMethod] = useState<'wire' | 'card' | 'swift'>('wire');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProceed = () => {
    const num = parseFloat(amount) || 2500;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(num);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Destination Account Card */}
      <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-[#e5eeff]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#e5eeff] text-[#004ac6] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
          </div>
          <div>
            <span className="text-[11px] text-[#737686] font-medium uppercase tracking-wider block">
              Destination Account
            </span>
            <span className="font-bold text-[14px] text-[#0b1c30]">Personal USD Wallet</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#737686] block">Current Balance</span>
          <span className="font-mono text-[13px] font-bold text-[#006242]">$14,250.00</span>
        </div>
      </div>

      {/* Deposit Amount Input Module */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <span className="text-[12px] font-bold text-[#737686] uppercase tracking-wider">
          Deposit Amount
        </span>

        <div className="flex items-center border-b-2 border-[#004ac6] pb-2">
          <span className="text-[28px] font-bold text-[#434655] mr-1">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-[32px] font-['Plus_Jakarta_Sans'] font-extrabold text-[#0b1c30] outline-none bg-transparent"
            placeholder="0.00"
          />
          <span className="text-[14px] font-bold text-[#434655] uppercase">USD</span>
        </div>

        {/* Quick Amount Presets */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {['500', '1000', '2500', '5000'].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(`${val}.00`)}
              className={`py-1.5 px-2 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                amount === `${val}.00`
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#434655] hover:bg-[#e5eeff]'
              }`}
            >
              +${parseInt(val).toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Select On-Ramp Method */}
      <div className="space-y-2">
        <h2 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
          Select On-Ramp Method
        </h2>

        <div className="space-y-2">
          {/* Option 1: Local Bank Transfer */}
          <div
            onClick={() => setMethod('wire')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              method === 'wire'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff] hover:bg-[#eff4ff]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  method === 'wire' ? 'bg-[#004ac6] text-white' : 'bg-[#e5eeff] text-[#434655]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[14px] text-[#0b1c30]">Local Bank Transfer</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#6ffbbe]/40 text-[#002113] text-[10px] font-bold">
                    Fast Wire
                  </span>
                </div>
                <span className="text-[11px] text-[#434655]">Pollar Virtual Clearing • Instant</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-bold text-[#006242]">FREE</span>
              <span className="text-[10px] text-[#737686] block">~10 mins</span>
            </div>
          </div>

          {/* Option 2: Instant Card */}
          <div
            onClick={() => setMethod('card')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              method === 'card'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff] hover:bg-[#eff4ff]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  method === 'card' ? 'bg-[#004ac6] text-white' : 'bg-[#e5eeff] text-[#434655]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">credit_card</span>
              </div>
              <div>
                <span className="font-bold text-[14px] text-[#0b1c30] block">
                  Debit / Instant Card
                </span>
                <span className="text-[11px] text-[#434655]">Visa, Mastercard, Maestro</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-bold text-[#434655]">0.8% Fee</span>
              <span className="text-[10px] text-[#737686] block">Instantaneous</span>
            </div>
          </div>

          {/* Option 3: SWIFT Wire */}
          <div
            onClick={() => setMethod('swift')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              method === 'swift'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff] hover:bg-[#eff4ff]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  method === 'swift' ? 'bg-[#004ac6] text-white' : 'bg-[#e5eeff] text-[#434655]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">public</span>
              </div>
              <div>
                <span className="font-bold text-[14px] text-[#0b1c30] block">
                  International SWIFT
                </span>
                <span className="text-[11px] text-[#434655]">Cross-border high value wire</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-bold text-[#434655]">$15.00 Flat</span>
              <span className="text-[10px] text-[#737686] block">1-2 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Wire Routing Details Accordion */}
      {method === 'wire' && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#eff4ff] pb-2">
            <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#0b1c30]">
              Direct Wire Routing Details
            </span>
            <span className="text-[10px] font-bold text-[#004ac6] bg-[#dbe1ff] px-2 py-0.5 rounded-full">
              FDIC Insured
            </span>
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between items-center py-1">
              <span className="text-[#737686]">Beneficiary Name:</span>
              <span className="font-bold text-[#0b1c30]">Funda Custody LLC</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-[#eff4ff]">
              <span className="text-[#737686]">Routing Number (ABA):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#0b1c30]">021000021</span>
                <button
                  onClick={() => handleCopy('021000021', 'Routing')}
                  className="p-1 rounded hover:bg-[#eff4ff] text-[#004ac6] cursor-pointer"
                  title="Copy"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-[#eff4ff]">
              <span className="text-[#737686]">Virtual Account Number:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#0b1c30]">8839-2091-8841</span>
                <button
                  onClick={() => handleCopy('8839-2091-8841', 'Account')}
                  className="p-1 rounded hover:bg-[#eff4ff] text-[#004ac6] cursor-pointer"
                  title="Copy"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
              </div>
            </div>

            {/* Mandatory Reference Memo Box */}
            <div className="p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#004ac6] font-bold uppercase tracking-wider block">
                  Mandatory Reference Memo
                </span>
                <span className="font-mono text-[14px] font-extrabold text-[#0b1c30]">
                  FD-V9941
                </span>
              </div>
              <button
                onClick={() => handleCopy('FD-V9941', 'Memo')}
                className="px-2.5 py-1 bg-[#004ac6] text-white rounded-lg font-bold text-[11px] hover:bg-[#2563eb] cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>{copiedField === 'Memo' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice Banner */}
      <div className="p-3 rounded-xl bg-[#eff4ff] text-[#434655] text-[11px] leading-relaxed flex items-start gap-2">
        <span className="material-symbols-outlined text-[#004ac6] text-[16px] shrink-0 mt-0.5">
          info
        </span>
        <p>
          Deposits without the mandatory reference memo <strong>FD-V9941</strong> are placed into a
          quarantine escrow hold until verified by manual AML review.
        </p>
      </div>

      {/* Action CTA Button */}
      <button
        onClick={handleProceed}
        disabled={isProcessing}
        className="w-full py-3.5 px-4 bg-[#004ac6] text-white rounded-xl font-bold text-[15px] shadow-md hover:bg-[#2563eb] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {isProcessing ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Connecting to Pollar Fast Wire...</span>
          </>
        ) : (
          <>
            <span>Proceed to Deposit ${amount}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </>
        )}
      </button>
    </div>
  );
};
