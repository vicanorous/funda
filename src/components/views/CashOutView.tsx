import React, { useState } from 'react';

interface CashOutViewProps {
  onBack: () => void;
  onSuccess: (amount: number, bankRef: string) => void;
}

export const CashOutView: React.FC<CashOutViewProps> = ({ onBack, onSuccess }) => {
  const [amount, setAmount] = useState('3200.00');
  const [route, setRoute] = useState<'standard' | 'instant'>('instant');
  const [isProcessing, setIsProcessing] = useState(false);

  const numAmount = parseFloat(amount) || 3200;
  const fee = route === 'instant' ? 1.5 : 0.0;
  const netAmount = Math.max(numAmount - fee, 0);

  const handleAuthorize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(numAmount, 'J.P. Morgan Chase ****4812');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Source Wallet Card */}
      <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-[#e5eeff]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#e5eeff] text-[#004ac6] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
          </div>
          <div>
            <span className="text-[11px] text-[#737686] font-medium uppercase tracking-wider block">
              Withdraw From
            </span>
            <span className="font-bold text-[14px] text-[#0b1c30]">Personal USD Wallet</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#737686] block">Available</span>
          <span className="font-mono text-[13px] font-bold text-[#006242]">$14,250.00</span>
        </div>
      </div>

      {/* Transfer Amount Input */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <span className="text-[12px] font-bold text-[#737686] uppercase tracking-wider">
          Transfer Amount
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
          {['500', '1000', '2500', '14250'].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val === '14250' ? '14250.00' : `${val}.00`)}
              className="py-1.5 px-2 rounded-xl text-[12px] font-bold bg-[#eff4ff] text-[#434655] hover:bg-[#e5eeff] transition-all cursor-pointer"
            >
              {val === '14250' ? 'All' : `+$${parseInt(val).toLocaleString()}`}
            </button>
          ))}
        </div>
      </div>

      {/* Payout Destination Card */}
      <div className="space-y-2">
        <span className="text-[12px] font-bold text-[#737686] uppercase tracking-wider block">
          Payout Destination
        </span>

        <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-[#004ac6] ring-1 ring-[#004ac6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#004ac6] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <div>
              <span className="font-bold text-[14px] text-[#0b1c30] block">
                J.P. Morgan Chase &amp; Co.
              </span>
              <span className="text-[12px] text-[#434655]">
                Checking •••• 4812 • Alex Vance
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#002113] text-[10px] font-bold">
            Verified Rail
          </span>
        </div>
      </div>

      {/* Settlement Route Selection */}
      <div className="space-y-2">
        <span className="text-[12px] font-bold text-[#737686] uppercase tracking-wider block">
          Settlement Route
        </span>

        <div className="grid grid-cols-2 gap-2">
          {/* Instant Off-Ramp */}
          <div
            onClick={() => setRoute('instant')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
              route === 'instant'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[13px] text-[#0b1c30]">Instant RTP</span>
              <span className="text-[11px] font-bold text-[#004ac6]">$1.50</span>
            </div>
            <span className="text-[11px] text-[#007d55] font-semibold block">~15 mins</span>
          </div>

          {/* Standard ACH Wire */}
          <div
            onClick={() => setRoute('standard')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
              route === 'standard'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[13px] text-[#0b1c30]">Standard ACH</span>
              <span className="text-[11px] font-bold text-[#006242]">FREE</span>
            </div>
            <span className="text-[11px] text-[#737686] block">Today by 16:30</span>
          </div>
        </div>
      </div>

      {/* Transaction Summary Breakdown */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-2 text-[12px]">
        <div className="flex justify-between text-[#434655]">
          <span>Gross Payout:</span>
          <span className="font-mono text-[#0b1c30]">${numAmount.toFixed(2)} USD</span>
        </div>
        <div className="flex justify-between text-[#434655]">
          <span>Settlement Rail Fee:</span>
          <span className="font-mono text-[#0b1c30]">${fee.toFixed(2)} USD</span>
        </div>
        <div className="flex justify-between text-[#434655]">
          <span>Arrival Estimate:</span>
          <span className="font-semibold text-[#006242]">
            {route === 'instant' ? 'Today in ~15 mins' : 'Today by 16:30 PM'}
          </span>
        </div>
        <div className="flex justify-between font-bold text-[14px] text-[#0b1c30] pt-2 border-t border-[#eff4ff]">
          <span>Net Dispatched:</span>
          <span className="font-mono text-[#004ac6]">${netAmount.toFixed(2)} USD</span>
        </div>
      </div>

      {/* Action CTA */}
      <button
        onClick={handleAuthorize}
        disabled={isProcessing || numAmount <= 0}
        className="w-full py-3.5 px-4 bg-[#004ac6] text-white rounded-xl font-bold text-[15px] shadow-md hover:bg-[#2563eb] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {isProcessing ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Signing Off-Ramp Disbursement...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Authorize Cash Out of ${numAmount.toFixed(2)}</span>
          </>
        )}
      </button>
    </div>
  );
};
