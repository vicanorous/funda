import React, { useEffect, useState } from 'react';
import {
  PollarExchangeService,
  SUPPORTED_CURRENCIES,
  SupportedCurrency,
} from '../../lib/pollar/exchange';
import { JointAccount, PersonalWalletState } from '../../types';

interface FxExchangeViewProps {
  walletState?: PersonalWalletState;
  jointAccounts?: JointAccount[];
  onBack: () => void;
  onSuccess: (
    spentAmount: number,
    receivedAmount: number,
    fromCurrency: string,
    toCurrency: string,
    targetVaultId?: string,
  ) => void;
}

export const FxExchangeView: React.FC<FxExchangeViewProps> = ({
  walletState,
  jointAccounts = [],
  onBack,
  onSuccess,
}) => {
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('NGN');
  const [payAmount, setPayAmount] = useState('1000.00');
  const [targetAccount, setTargetAccount] = useState<string>('personal');
  const [countdown, setCountdown] = useState(45);
  const [isExecuting, setIsExecuting] = useState(false);

  const numPay = parseFloat(payAmount) || 0;

  // Compute live guaranteed quote from Pollar Exchange Service
  const quote = PollarExchangeService.getQuote(fromCurrency, toCurrency, numPay);

  // Available balance for chosen fromCurrency
  const getAvailableBalance = (curr: string): number => {
    if (!walletState) return 0;
    if (curr === 'USD') return walletState.holdings.usd || 0;
    if (curr === 'NGN') return walletState.holdings.ngn || 0;
    if (curr === 'EUR') return walletState.holdings.eur || 0;
    if (curr === 'GBP') return walletState.holdings.gbp || 0;
    return 0;
  };

  const availableBalance = getAvailableBalance(fromCurrency);

  // Rate lock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePercentage = (pct: number) => {
    const calc = ((availableBalance * pct) / 100).toFixed(fromCurrency === 'NGN' ? 0 : 2);
    setPayAmount(calc);
  };

  const handleSwapCurrencies = () => {
    const prevFrom = fromCurrency;
    const prevTo = toCurrency;
    setFromCurrency(prevTo);
    setToCurrency(prevFrom);
  };

  const handleConvert = () => {
    if (numPay <= 0) return;
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      onSuccess(
        numPay,
        quote.receivedAmount,
        fromCurrency,
        toCurrency,
        targetAccount === 'personal' ? undefined : targetAccount,
      );
    }, 1200);
  };

  const fromInfo = SUPPORTED_CURRENCIES.find((c) => c.code === fromCurrency);
  const toInfo = SUPPORTED_CURRENCIES.find((c) => c.code === toCurrency);

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Liquidity Live & Rate Lock Countdown */}
      <div className="p-3 bg-[#e5eeff] rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#007d55] animate-pulse" />
          <span className="text-[12px] font-bold text-[#0b1c30]">
            Pollar West Africa &amp; Global Liquidity Live
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#004ac6] font-bold bg-white px-2.5 py-0.5 rounded-full shadow-xs">
          <span className="material-symbols-outlined text-[14px]">timer</span>
          <span>Lock: 00:{countdown < 10 ? `0${countdown}` : countdown}</span>
        </div>
      </div>

      {/* Currency Pair Quick Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { from: 'USD', to: 'NGN', label: 'USD → NGN (₦)' },
          { from: 'NGN', to: 'USD', label: 'NGN → USD ($)' },
          { from: 'EUR', to: 'NGN', label: 'EUR → NGN (₦)' },
          { from: 'GBP', to: 'NGN', label: 'GBP → NGN (₦)' },
          { from: 'USD', to: 'EUR', label: 'USD → EUR (€)' },
        ].map((pair) => (
          <button
            key={`${pair.from}-${pair.to}`}
            onClick={() => {
              setFromCurrency(pair.from);
              setToCurrency(pair.to);
            }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              fromCurrency === pair.from && toCurrency === pair.to
                ? 'bg-[#004ac6] text-white shadow-xs'
                : 'bg-white text-[#434655] border border-[#e5eeff] hover:bg-[#eff4ff]'
            }`}
          >
            {pair.label}
          </button>
        ))}
      </div>

      {/* You Pay Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-2 relative">
        <div className="flex justify-between items-center text-[12px] text-[#737686] font-semibold">
          <span>You Pay</span>
          <span className="text-[#0b1c30] font-medium">
            Balance: {PollarExchangeService.formatAmount(availableBalance, fromCurrency)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 gap-2">
          <input
            type="number"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className="w-3/5 text-[28px] font-['Plus_Jakarta_Sans'] font-extrabold text-[#0b1c30] outline-none"
            placeholder="0.00"
          />

          <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl border border-[#dce9ff]">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="bg-transparent font-bold text-[13px] text-[#0b1c30] outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} disabled={c.code === toCurrency}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
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
        <button
          onClick={handleSwapCurrencies}
          title="Swap Currency Pair"
          className="w-10 h-10 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-md cursor-pointer hover:rotate-180 transition-transform duration-300 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">swap_vert</span>
        </button>
      </div>

      {/* You Receive Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-2">
        <div className="flex justify-between items-center text-[12px] text-[#737686] font-semibold">
          <span>You Receive (Guaranteed)</span>
          <span className="text-[#007d55] font-bold">
            1 {fromCurrency} = {quote.guaranteedRate.toLocaleString()} {toCurrency}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 gap-2">
          <div className="text-[26px] font-['Plus_Jakarta_Sans'] font-extrabold text-[#006242] truncate">
            {PollarExchangeService.formatAmount(quote.receivedAmount, toCurrency)}
          </div>

          <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl border border-[#dce9ff] flex-shrink-0">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="bg-transparent font-bold text-[13px] text-[#0b1c30] outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} disabled={c.code === fromCurrency}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pollar Transparent Pricing Breakdown */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-[#eff4ff]">
          <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#0b1c30]">
            Transparent Wholesale Execution
          </span>
          <span className="text-[10px] font-bold text-[#006242] bg-[#6ffbbe]/30 px-2 py-0.5 rounded-full">
            Institutional Rate
          </span>
        </div>

        <div className="space-y-1.5 text-[12px]">
          <div className="flex justify-between text-[#434655]">
            <span>Market Mid-Rate:</span>
            <span className="font-mono text-[#0b1c30]">
              1 {fromCurrency} = {quote.marketMidRate.toLocaleString()} {toCurrency}
            </span>
          </div>
          <div className="flex justify-between text-[#434655]">
            <span>Funda Wholesale Spread:</span>
            <span className="font-mono text-[#006242] font-bold">0.12% (Tier 1 Institutional)</span>
          </div>
          <div className="flex justify-between text-[#434655]">
            <span>Est. Savings vs Traditional Retail Bank:</span>
            <span className="font-mono text-[#006242] font-bold">
              +{PollarExchangeService.formatAmount(quote.savedVsRetailBank, toCurrency)} saved
            </span>
          </div>
          <div className="flex justify-between text-[#434655] pt-1 border-t border-[#eff4ff]">
            <span>Network Settlement Fee:</span>
            <span className="font-bold text-[#004ac6]">Free (Pollar Sponsored)</span>
          </div>
        </div>
      </div>

      {/* Target Deposit Account Selector */}
      <div className="space-y-2">
        <span className="text-[12px] font-bold text-[#737686] uppercase tracking-wider block">
          Credit Converted Funds To
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTargetAccount('personal')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              targetAccount === 'personal'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff]'
            }`}
          >
            <span className="text-[12px] font-bold text-[#0b1c30] block">Personal Wallet</span>
            <span className="text-[10px] text-[#737686]">Sole ownership treasury</span>
          </button>

          {jointAccounts.map((vault) => (
            <button
              key={vault.id}
              type="button"
              onClick={() => setTargetAccount(vault.id)}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                targetAccount === vault.id
                  ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                  : 'bg-white border-[#e5eeff]'
              }`}
            >
              <span className="text-[12px] font-bold text-[#0b1c30] block truncate">{vault.name}</span>
              <span className="text-[10px] text-[#737686]">{vault.governanceRule} Vault</span>
            </button>
          ))}
        </div>
      </div>

      {/* Execute FX Action Button */}
      <button
        onClick={handleConvert}
        disabled={isExecuting || numPay <= 0 || numPay > availableBalance}
        className="w-full py-3.5 px-4 bg-[#004ac6] text-white rounded-xl font-bold text-[15px] shadow-md hover:bg-[#2563eb] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {isExecuting ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Locking Rate &amp; Converting via Pollar...</span>
          </>
        ) : numPay > availableBalance ? (
          <span>Insufficient {fromCurrency} Balance</span>
        ) : (
          <>
            <span>
              Convert {fromCurrency} to {toCurrency}
            </span>
            <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
          </>
        )}
      </button>
    </div>
  );
};
