import React, { useEffect, useState } from 'react';

interface FxExchangeViewProps {
  onBack: () => void;
  onSuccess: (usdAmount: number, hkdAmount: number) => void;
}

export const FxExchangeView: React.FC<FxExchangeViewProps> = ({ onBack, onSuccess }) => {
  const [payAmount, setPayAmount] = useState('1000.00');
  const [targetAccount, setTargetAccount] = useState<'personal_hkd' | 'joint_vault'>('personal_hkd');
  const [countdown, setCountdown] = useState(43);
  const [isExecuting, setIsExecuting] = useState(false);

  const rate = 7.8214;
  const numPay = parseFloat(payAmount) || 0;
  const receiveAmount = (numPay * rate).toFixed(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePercentage = (pct: number) => {
    const total = 14250.0;
    const calc = ((total * pct) / 100).toFixed(2);
    setPayAmount(calc);
  };

  const handleConvert = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      onSuccess(numPay, parseFloat(receiveAmount));
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Liquidity Live & Rate Lock Countdown */}
      <div className="p-3 bg-[#e5eeff] rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#007d55] animate-pulse" />
          <span className="text-[12px] font-bold text-[#0b1c30]">
            Pollar Treasury Liquidity Live
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#004ac6] font-bold bg-white px-2.5 py-0.5 rounded-full shadow-xs">
          <span className="material-symbols-outlined text-[14px]">timer</span>
          <span>Rate Lock: 00:{countdown < 10 ? `0${countdown}` : countdown}</span>
        </div>
      </div>

      {/* You Pay Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-2 relative">
        <div className="flex justify-between items-center text-[12px] text-[#737686] font-semibold">
          <span>You Pay</span>
          <span>Balance: $14,250.00 USD</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <input
            type="number"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className="w-2/3 text-[28px] font-['Plus_Jakarta_Sans'] font-extrabold text-[#0b1c30] outline-none"
            placeholder="0.00"
          />
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
            <div className="w-5 h-5 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-[11px] font-bold">
              $
            </div>
            <span className="font-bold text-[14px] text-[#0b1c30]">USD</span>
          </div>
        </div>

        {/* Quick Percentage Presets */}
        <div className="grid grid-cols-4 gap-1.5 pt-2">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              onClick={() => handlePercentage(pct)}
              className="py-1 rounded-lg text-[11px] font-bold bg-[#eff4ff] text-[#434655] hover:bg-[#e5eeff] transition-all cursor-pointer"
            >
              {pct === 100 ? 'Max' : `${pct}%`}
            </button>
          ))}
        </div>
      </div>

      {/* Centered Swap Indicator */}
      <div className="flex items-center justify-center -my-2 relative z-10">
        <div className="w-10 h-10 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-md cursor-pointer hover:rotate-180 transition-transform duration-300">
          <span className="material-symbols-outlined text-[20px]">swap_vert</span>
        </div>
      </div>

      {/* You Receive Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-2">
        <div className="flex justify-between items-center text-[12px] text-[#737686] font-semibold">
          <span>You Receive (Guaranteed)</span>
          <span className="text-[#007d55] font-bold">1 USD = {rate} HKD</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-[28px] font-['Plus_Jakarta_Sans'] font-extrabold text-[#006242]">
            {parseFloat(receiveAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
            <div className="w-5 h-5 rounded-full bg-[#007d55] text-white flex items-center justify-center text-[10px] font-bold">
              HK$
            </div>
            <span className="font-bold text-[14px] text-[#0b1c30]">HKD</span>
          </div>
        </div>
      </div>

      {/* Pollar Transparent Pricing Breakdown */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-[#eff4ff]">
          <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#0b1c30]">
            Transparent Execution Breakdown
          </span>
          <span className="text-[10px] font-bold text-[#006242] bg-[#6ffbbe]/30 px-2 py-0.5 rounded-full">
            Institutional Pricing
          </span>
        </div>

        <div className="space-y-1.5 text-[12px]">
          <div className="flex justify-between text-[#434655]">
            <span>Market Mid-Rate:</span>
            <span className="font-mono text-[#0b1c30]">7.8225 HKD</span>
          </div>
          <div className="flex justify-between text-[#434655]">
            <span>Funda Spread:</span>
            <span className="font-mono text-[#006242] font-bold">0.12% (Wholesale)</span>
          </div>
          <div className="flex justify-between text-[#434655]">
            <span>Est. Savings vs Traditional Bank:</span>
            <span className="font-mono text-[#006242] font-bold">+HK$ 9.38 saved</span>
          </div>
          <div className="flex justify-between text-[#434655] pt-1 border-t border-[#eff4ff]">
            <span>Network Execution Fee:</span>
            <span className="font-bold text-[#004ac6]">0.00 USD</span>
          </div>
        </div>
      </div>

      {/* Target Deposit Account Selector */}
      <div className="space-y-2">
        <span className="text-[12px] font-bold text-[#737686] uppercase tracking-wider block">
          Deposit Converted Funds Into
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTargetAccount('personal_hkd')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              targetAccount === 'personal_hkd'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff]'
            }`}
          >
            <span className="text-[12px] font-bold text-[#0b1c30] block">Personal HKD Wallet</span>
            <span className="text-[10px] text-[#737686]">Sole ownership</span>
          </button>

          <button
            onClick={() => setTargetAccount('joint_vault')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              targetAccount === 'joint_vault'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff]'
            }`}
          >
            <span className="text-[12px] font-bold text-[#0b1c30] block">Alpha Ventures Vault</span>
            <span className="text-[10px] text-[#737686]">Multi-Sig Pooled</span>
          </button>
        </div>
      </div>

      {/* Execute FX Action Button */}
      <button
        onClick={handleConvert}
        disabled={isExecuting || numPay <= 0}
        className="w-full py-3.5 px-4 bg-[#004ac6] text-white rounded-xl font-bold text-[15px] shadow-md hover:bg-[#2563eb] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {isExecuting ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Locking Rate &amp; Minting HKD...</span>
          </>
        ) : (
          <>
            <span>Review &amp; Convert USD to HKD</span>
            <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
          </>
        )}
      </button>
    </div>
  );
};
