import React, { useState } from 'react';
import { PersonalWalletState } from '../../types';

interface PersonalWalletViewProps {
  walletState: PersonalWalletState;
  onNavigate: (route: string) => void;
}

export const PersonalWalletView: React.FC<PersonalWalletViewProps> = ({
  walletState,
  onNavigate,
}) => {
  const [hideBalances, setHideBalances] = useState(false);
  const [autoTopup, setAutoTopup] = useState(walletState.guardrails.autoTopupEnabled);

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Top User Profile Identity Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-[14px] shadow-xs">
            LC
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#0b1c30]">
                Liam Chen
              </h1>
              <span className="px-1.5 py-0.2 rounded-full bg-[#007d55]/15 text-[#006242] text-[10px] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                <span>Tier 2 Verified</span>
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#737686]">ID: #8841-PLR</span>
          </div>
        </div>
        <button
          onClick={() => setHideBalances(!hideBalances)}
          className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#737686] hover:text-[#0b1c30] cursor-pointer"
          aria-label="Toggle balance visibility"
        >
          <span className="material-symbols-outlined text-[20px]">
            {hideBalances ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>

      {/* Total Personal Treasury Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#737686]">Total Personal Treasury</span>
          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#002113] text-[11px] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">trending_up</span>
            <span>+2.41% APY Active</span>
          </span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-[20px] text-[#434655] font-semibold">$</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[34px] font-extrabold text-[#0b1c30] tracking-tight">
            {hideBalances ? '••••••' : walletState.totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[13px] text-[#434655] font-semibold">USD</span>
        </div>

        {/* Currency Weight Visualizer Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] text-[#737686] font-semibold">
            <span>Portfolio Allocation</span>
            <span>USD 78% • HKD 14% • EUR 8%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#eff4ff]">
            <div className="bg-[#004ac6] h-full" style={{ width: '78%' }} />
            <div className="bg-[#007d55] h-full" style={{ width: '14%' }} />
            <div className="bg-[#565e74] h-full" style={{ width: '8%' }} />
          </div>
        </div>
      </div>

      {/* 4 Action Buttons Row */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onNavigate('wallet/fund')}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">add</span>
          </div>
          <span className="text-[12px] font-bold text-[#0b1c30]">Fund</span>
          <span className="text-[10px] text-[#737686]">Deposit</span>
        </button>

        <button
          onClick={() => onNavigate('wallet/exchange')}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#e5eeff] text-[#004ac6] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
          </div>
          <span className="text-[12px] font-bold text-[#0b1c30]">Convert</span>
          <span className="text-[10px] text-[#737686]">FX Swap</span>
        </button>

        <button
          onClick={() => onNavigate('wallet/cash-out')}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#e5eeff] text-[#004ac6] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
          </div>
          <span className="text-[12px] font-bold text-[#0b1c30]">Cash Out</span>
          <span className="text-[10px] text-[#737686]">Bank Wire</span>
        </button>

        <button
          onClick={() => onNavigate('joint')}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#dce9ff] text-[#004ac6] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">groups</span>
          </div>
          <span className="text-[12px] font-bold text-[#0b1c30]">To Joint</span>
          <span className="text-[10px] text-[#737686]">Transfer</span>
        </button>
      </div>

      {/* Currency Holdings Section */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
            Currency Holdings
          </h2>
          <span className="text-[11px] text-[#004ac6] font-bold">Instant Liquidity</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e5eeff]/60 overflow-hidden divide-y divide-[#eff4ff]">
          {/* USD Holding */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-[14px]">
                $
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[14px] text-[#0b1c30]">United States Dollar</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#dbe1ff] text-[#004ac6] rounded-full font-bold">
                    USD
                  </span>
                </div>
                <span className="text-[11px] text-[#737686]">Primary Settlement Reserve</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-[15px] text-[#0b1c30]">
                {hideBalances ? '••••••' : `$${walletState.holdings.usd.toLocaleString()}`}
              </div>
              <button
                onClick={() => onNavigate('wallet/exchange')}
                className="text-[11px] font-bold text-[#004ac6] hover:underline cursor-pointer"
              >
                Convert
              </button>
            </div>
          </div>

          {/* HKD Holding */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#007d55] text-white flex items-center justify-center font-bold text-[13px]">
                HK$
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[14px] text-[#0b1c30]">Hong Kong Dollar</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#6ffbbe]/30 text-[#002113] rounded-full font-bold">
                    HKD
                  </span>
                </div>
                <span className="text-[11px] text-[#737686]">≈ $2,000.00 USD</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-[15px] text-[#0b1c30]">
                {hideBalances ? '••••••' : `HK$ ${walletState.holdings.hkd.toLocaleString()}`}
              </div>
              <button
                onClick={() => onNavigate('wallet/exchange')}
                className="text-[11px] font-bold text-[#004ac6] hover:underline cursor-pointer"
              >
                Convert
              </button>
            </div>
          </div>

          {/* EUR Holding */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#565e74] text-white flex items-center justify-center font-bold text-[14px]">
                €
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[14px] text-[#0b1c30]">Euro</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#dae2fd] text-[#131b2e] rounded-full font-bold">
                    EUR
                  </span>
                </div>
                <span className="text-[11px] text-[#737686]">≈ $1,050.00 USD</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-[15px] text-[#0b1c30]">
                {hideBalances ? '••••••' : `€${walletState.holdings.eur.toLocaleString()}`}
              </div>
              <button
                onClick={() => onNavigate('wallet/exchange')}
                className="text-[11px] font-bold text-[#004ac6] hover:underline cursor-pointer"
              >
                Convert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Treasury Guardrails Card */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[20px]">
              security_update_good
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
              Treasury Guardrails
            </h2>
          </div>
          <span className="text-[11px] text-[#737686]">Smart Rules</span>
        </div>

        {/* Guardrail 1: Auto-Topup */}
        <div className="p-3 rounded-xl bg-[#eff4ff] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-bold text-[13px] text-[#0b1c30] block">
              Auto-Topup for Joint Vault #04
            </span>
            <p className="text-[11px] text-[#434655]">
              Dispatches $500.00 from Personal USD if vault falls below $1,000.
            </p>
          </div>
          <button
            onClick={() => setAutoTopup(!autoTopup)}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex-shrink-0 ${
              autoTopup ? 'bg-[#004ac6]' : 'bg-[#c3c6d7]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                autoTopup ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Guardrail 2: Target Reserve Floor */}
        <div className="p-3 rounded-xl bg-[#eff4ff] flex items-center justify-between">
          <div>
            <span className="font-bold text-[13px] text-[#0b1c30] block">
              Target USD Reserve Floor
            </span>
            <p className="text-[11px] text-[#434655]">
              Minimum guaranteed balance protected from auto-draws.
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-[13px] text-[#0b1c30]">$5,000.00</span>
            <span className="text-[10px] text-[#006242] block font-bold">Safely Protected</span>
          </div>
        </div>
      </div>

      {/* Settlement Rails Info */}
      <div className="p-3 rounded-xl bg-[#e5eeff] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white text-[#004ac6] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[18px]">account_balance</span>
        </div>
        <p className="text-[12px] text-[#434655] leading-snug">
          Connected to <strong>Pollar Network Direct Rail</strong> and Standard Chartered Bank for
          real-time institutional wire clearances.
        </p>
      </div>
    </div>
  );
};
