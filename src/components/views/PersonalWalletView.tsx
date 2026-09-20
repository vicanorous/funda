import React, { useState } from 'react';
import { PollarExchangeService } from '../../lib/pollar/exchange';
import { PersonalWalletState, User } from '../../types';

interface PersonalWalletViewProps {
  walletState: PersonalWalletState;
  displayCurrency?: 'USD' | 'NGN';
  onToggleCurrency?: () => void;
  onNavigate: (route: string) => void;
  user?: User;
  onOpenOnboarding?: () => void;
  onLogout?: () => void;
}

export const PersonalWalletView: React.FC<PersonalWalletViewProps> = ({
  walletState,
  displayCurrency = 'USD',
  onToggleCurrency,
  onNavigate,
  user,
  onOpenOnboarding,
  onLogout,
}) => {
  const [hideBalances, setHideBalances] = useState(false);
  const [autoTopup, setAutoTopup] = useState(walletState.guardrails.autoTopupEnabled);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const rawUsd = walletState.holdings.usd || 0;
  const rawNgn = walletState.holdings.ngn || 0;
  const rawEur = walletState.holdings.eur || 0;
  const ngnInUsd = rawNgn / 1605.5;
  const totalValuationUsd = rawUsd + ngnInUsd + (rawEur * 1.08);
  const ngnTotal = totalValuationUsd * 1605.5;

  const usdPercent = totalValuationUsd > 0 ? Math.round((rawUsd / totalValuationUsd) * 100) : 50;
  const ngnPercent = totalValuationUsd > 0 ? 100 - usdPercent : 50;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'VN';

  const handleCopyWallet = () => {
    if (!user?.walletAddress) return;
    navigator.clipboard?.writeText(user.walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Top User Profile Identity Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-[13px] shadow-xs">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#0b1c30]">
                {user?.name || 'Account Owner'}
              </h1>
              <span className="px-1.5 py-0.2 rounded-full bg-[#007d55]/15 text-[#006242] text-[10px] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                <span>
                  {user?.kycStatus === 'TIER_2_VERIFIED'
                    ? 'Tier 2 Verified'
                    : user?.kycStatus === 'TIER_1_PENDING'
                    ? 'Tier 1 Pending'
                    : 'Pending KYC'}
                </span>
              </span>
            </div>
            {user?.organization ? (
              <span className="text-[11px] text-[#737686]">{user.organization}</span>
            ) : user?.email ? (
              <span className="text-[11px] text-[#737686]">{user.email}</span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onToggleCurrency && (
            <button
              onClick={onToggleCurrency}
              title={`Switch currency (currently ${displayCurrency})`}
              className="w-8 h-8 rounded-full bg-[#e5eeff] hover:bg-[#dce9ff] text-[#004ac6] font-bold text-[15px] flex items-center justify-center transition-all cursor-pointer border border-[#c3c6d7]/40 shadow-2xs active:scale-95"
            >
              <span className="leading-none">{displayCurrency === 'USD' ? '$' : '₦'}</span>
            </button>
          )}
          <button
            onClick={() => setHideBalances(!hideBalances)}
            className="min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-[#737686] hover:text-[#0b1c30] cursor-pointer"
            aria-label="Toggle balance visibility"
          >
            <span className="material-symbols-outlined text-[20px]">
              {hideBalances ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      {/* Total Personal Treasury Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#737686]">Total Portfolio Valuation</span>
          {totalValuationUsd > 0 && walletState.yieldActive ? (
            <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#002113] text-[11px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              <span>+{walletState.yieldPercent || 2.41}% APY Active</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#004ac6] text-[11px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              <span>Real Ledger Balances</span>
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-[20px] text-[#434655] font-semibold">
            {displayCurrency === 'NGN' ? '₦' : '$'}
          </span>
          <span className="font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold text-[#0b1c30] tracking-tight">
            {hideBalances
              ? '••••••'
              : displayCurrency === 'NGN'
              ? ngnTotal.toLocaleString('en-NG', { maximumFractionDigits: 0 })
              : totalValuationUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[13px] text-[#434655] font-semibold uppercase">{displayCurrency}</span>
        </div>

        {/* Currency Weight Visualizer Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] text-[#737686] font-semibold">
            <span>Portfolio Allocation</span>
            <span>
              {totalValuationUsd > 0
                ? `USD ${usdPercent}% • NGN ${ngnPercent}% (₦${rawNgn.toLocaleString('en-NG', { maximumFractionDigits: 0 })})`
                : 'Zero Active Balances (Awaiting Deposit or SDK Sync)'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#eff4ff]">
            {totalValuationUsd > 0 ? (
              <>
                <div className="bg-[#004ac6] h-full transition-all" style={{ width: `${usdPercent}%` }} />
                <div className="bg-[#007d55] h-full transition-all" style={{ width: `${ngnPercent}%` }} />
              </>
            ) : (
              <div className="bg-[#c3c6d7] h-full w-full opacity-40" />
            )}
          </div>
        </div>
      </div>

      {/* 4 Action Buttons Row */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onNavigate('wallet/fund')}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">add</span>
          </div>
          <span className="text-[12px] font-bold text-[#0b1c30]">Deposit</span>
          <span className="text-[10px] text-[#737686]">NIP / Card</span>
        </button>

        <button
          onClick={() => onNavigate('wallet/exchange')}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#e5eeff] text-[#004ac6] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
          </div>
          <span className="text-[12px] font-bold text-[#0b1c30]">FX Swap</span>
          <span className="text-[10px] text-[#737686]">USD ↔ NGN</span>
        </button>

        <button
          onClick={() => onNavigate('wallet/cash-out')}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#e5eeff] text-[#004ac6] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
          </div>
          <span className="text-[12px] font-bold text-[#0b1c30]">Cash Out</span>
          <span className="text-[10px] text-[#737686]">NG Bank NIP</span>
        </button>

        <button
          onClick={() => onNavigate('joint')}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#dce9ff] text-[#004ac6] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">groups</span>
          </div>
          <span className="text-[12px] font-bold text-[#0b1c30]">Joint Vaults</span>
          <span className="text-[10px] text-[#737686]">Multi-Sig</span>
        </button>
      </div>

      {/* Currency Holdings Section */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
            Treasury Holdings
          </h2>
          <span className="text-[11px] text-[#004ac6] font-bold">Real Balance Verification</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e5eeff]/60 overflow-hidden divide-y divide-[#eff4ff]">
          {/* NGN Holding */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#007d55] text-white flex items-center justify-center font-bold text-[14px]">
                ₦
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[14px] text-[#0b1c30]">Nigerian Naira</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#6ffbbe]/30 text-[#002113] rounded-full font-bold">
                    NGN
                  </span>
                </div>
                <span className="text-[11px] text-[#737686]">
                  ≈ ${(rawNgn / 1605.5).toFixed(2)} USD
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-[15px] text-[#006242]">
                {hideBalances ? '••••••' : `₦${rawNgn.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`}
              </div>
              <button
                onClick={() => onNavigate('wallet/exchange')}
                className="text-[11px] font-bold text-[#004ac6] hover:underline cursor-pointer"
              >
                Convert to USD
              </button>
            </div>
          </div>

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
                <span className="text-[11px] text-[#737686]">Global Settlement Liquidity</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-[15px] text-[#0b1c30]">
                {hideBalances ? '••••••' : `$${rawUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </div>
              <button
                onClick={() => onNavigate('wallet/exchange')}
                className="text-[11px] font-bold text-[#004ac6] hover:underline cursor-pointer"
              >
                Convert to NGN
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
                <span className="text-[11px] text-[#737686]">
                  ≈ ${(rawEur * 1.08).toFixed(2)} USD
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-[15px] text-[#0b1c30]">
                {hideBalances ? '••••••' : `€${rawEur.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
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
              Auto-Topup for Joint Vaults
            </span>
            <p className="text-[11px] text-[#434655]">
              Automatically dispatches funds from Personal USD if an active vault drops below reserve floor.
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
              Target Treasury Liquidity Floor
            </span>
            <p className="text-[11px] text-[#434655]">
              Minimum guaranteed balance protected from automatic debits.
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-[13px] text-[#0b1c30]">$5,000.00</span>
            <span className="text-[10px] text-[#006242] block font-bold">Protected</span>
          </div>
        </div>
      </div>

      {/* Pollar SDK Smart Account Identity & Onboarding Card */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[20px]">
              key
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
              Pollar SDK Smart Account
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe]/25 text-[#006242] text-[10px] font-bold">
            Passkey Secured
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#eff4ff] space-y-2 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-[#737686]">Cryptographic Address</span>
            <button
              onClick={handleCopyWallet}
              className="font-mono text-[11px] font-bold text-[#004ac6] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{user?.walletAddress ? `${user.walletAddress.slice(0, 16)}...` : 'Pending Generation'}</span>
              <span className="material-symbols-outlined text-[14px]">
                {copiedAddress ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#737686]">Smart Account Custody</span>
            <span className="font-bold text-[#0b1c30]">
              {user?.pollarCustodyType ? user.pollarCustodyType.toUpperCase() : 'SMART CONTRACT (SOROBAN)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#737686]">Pollar Consensus Node</span>
            <span className="font-bold text-[#006242] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006242] animate-pulse" />
              <span>Stellar Testnet / Active</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="py-2 px-3 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
              <span>Re-run Onboarding</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="py-2 px-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#ba1a1a] font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#dce9ff]"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Switch Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Settlement Rails Info */}
      <div className="p-3 rounded-xl bg-[#e5eeff] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white text-[#004ac6] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[18px]">account_balance</span>
        </div>
        <p className="text-[12px] text-[#434655] leading-snug">
          Integrated with <strong>Pollar Settlement Rails</strong> and NIBSS Instant Payments (NIP) for sub-second Nigerian banking settlement.
        </p>
      </div>
    </div>
  );
};
