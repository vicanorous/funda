import React, { useState } from 'react';
import { JointAccount, PersonalWalletState, Transaction, User } from '../../types';

interface HomeViewProps {
  jointAccounts: JointAccount[];
  personalWallet?: PersonalWalletState;
  transactions?: Transaction[];
  displayCurrency?: 'USD' | 'NGN';
  onToggleCurrency?: () => void;
  onNavigate: (route: string) => void;
  onOpenVault: (vaultId: string) => void;
  onOpenWithdrawalReview: () => void;
  user?: User;
  onStartOnboarding?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  jointAccounts,
  personalWallet,
  transactions = [],
  displayCurrency = 'USD',
  onToggleCurrency,
  onNavigate,
  onOpenVault,
  onOpenWithdrawalReview,
  user,
  onStartOnboarding,
}) => {
  const [balanceMode, setBalanceMode] = useState<'personal' | 'joint'>('personal');

  const rawPersonalUsd = personalWallet?.totalUsd ?? 0.0;
  const rawJointUsd = jointAccounts.reduce((acc, v) => acc + (v.balance || 0), 0);

  const formattedPersonal =
    displayCurrency === 'NGN'
      ? `₦${(rawPersonalUsd * 1605.5).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
      : `$${rawPersonalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const formattedJoint =
    displayCurrency === 'NGN'
      ? `₦${(rawJointUsd * 1605.5).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
      : `$${rawJointUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Onboarding Incomplete Banner if user not yet onboarded */}
      {user?.isOnboarded === false && onStartOnboarding && (
        <div className="p-3.5 bg-gradient-to-r from-[#eff4ff] via-[#e5eeff] to-[#eff4ff] rounded-2xl border border-[#004ac6]/30 flex items-center justify-between shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#004ac6] text-white flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </div>
            <div>
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] text-[#0b1c30] block">
                Pollar Onboarding Incomplete
              </span>
              <span className="text-[11px] text-[#434655]">
                Provision your Passkey Smart Wallet and verify compliance.
              </span>
            </div>
          </div>
          <button
            onClick={onStartOnboarding}
            className="px-3 py-1.5 rounded-xl bg-[#004ac6] text-white font-bold text-[11px] shadow-2xs hover:bg-[#003ea8] cursor-pointer flex-shrink-0"
          >
            Start Setup
          </button>
        </div>
      )}

      {/* Top Section: Combined Treasury Balance Card (Deep Cobalt with Interactive Toggle) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#004ac6] via-[#1d58d8] to-[#003899] p-4 shadow-md text-white">
        {/* Ambient organic glow background decor */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#6ffbbe]/15 blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-[#dbe1ff]/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80 font-['Inter']">
              Treasury Liquidity Balance
            </span>
            <div
              onClick={() => onNavigate('wallet/exchange')}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-full backdrop-blur-md cursor-pointer transition-colors"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#6ffbbe] animate-pulse" />
              <span className="text-[11px] text-white font-medium">
                1 USD ≈ 1,605.50 NGN
              </span>
            </div>
          </div>

          {/* Segmented Pill Selector (Personal vs Joint Share) */}
          <div className="grid grid-cols-2 bg-white/20 p-1 rounded-xl backdrop-blur-md gap-1">
            <button
              onClick={() => setBalanceMode('personal')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                balanceMode === 'personal'
                  ? 'bg-white text-[#004ac6] shadow-sm'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
              <span>Personal Treasury</span>
            </button>
            <button
              onClick={() => setBalanceMode('joint')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                balanceMode === 'joint'
                  ? 'bg-white text-[#004ac6] shadow-sm'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">group_work</span>
              <span>Joint Vaults</span>
            </button>
          </div>

          {/* Primary Balance Display */}
          <div className="flex flex-col pt-1">
            <div className="flex items-baseline gap-1.5">
              <h1 className="text-[32px] font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                {balanceMode === 'personal' ? formattedPersonal : formattedJoint}
              </h1>
              <span className="text-[12px] text-white/75 font-semibold uppercase tracking-wide">
                {displayCurrency}
              </span>
            </div>

            <div className="text-[12px] text-white/80 flex items-center gap-1.5 mt-0.5">
              {balanceMode === 'personal' ? (
                <>
                  <span>
                    {displayCurrency === 'NGN'
                      ? `≈ $${rawPersonalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD reserve`
                      : `≈ ₦${(rawPersonalUsd * 1605.5).toLocaleString('en-NG', { maximumFractionDigits: 0 })} NGN available`}
                  </span>
                  {rawPersonalUsd > 0 && personalWallet?.yieldActive ? (
                    <span className="text-[10px] font-semibold bg-[#007d55]/40 px-1.5 py-0.2 rounded text-[#bdffdb]">
                      +{personalWallet.yieldPercent || 2.41}% yield
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold bg-white/20 px-1.5 py-0.2 rounded text-white/90">
                      Real Ledger Balance
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span>Across {jointAccounts.length} active multi-sig vaults</span>
                  <span className="text-[10px] font-semibold bg-white/30 px-1.5 py-0.2 rounded text-white">
                    2/3 Quorum Protected
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Safe Audit Meta */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-white/85">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              <span className="text-[11px] font-medium">Pollar Institutional Rails • Multi-Sig 2/3</span>
            </div>
            <span className="font-mono text-[11px] text-white/80 font-medium">Ref #FND-LOS-9941</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Row (4 Circular cobalt-accented buttons) */}
      <div className="grid grid-cols-4 gap-2">
        {/* Action 1: Fund Wallet */}
        <button
          onClick={() => onNavigate('wallet/fund')}
          className="flex flex-col items-center gap-1 group p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-md group-hover:scale-105 group-active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">add_card</span>
          </div>
          <span className="text-[12px] text-[#0b1c30] font-bold text-center leading-tight">
            Deposit
          </span>
          <span className="text-[10px] text-[#434655]">NIP / Cards</span>
        </button>

        {/* Action 2: Exchange */}
        <button
          onClick={() => onNavigate('wallet/exchange')}
          className="flex flex-col items-center gap-1 group p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#e5eeff] text-[#004ac6] flex items-center justify-center shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">currency_exchange</span>
          </div>
          <span className="text-[12px] text-[#0b1c30] font-bold text-center leading-tight">
            FX Swap
          </span>
          <span className="text-[10px] text-[#006242] font-semibold">USD ↔ NGN</span>
        </button>

        {/* Action 3: Cash Out */}
        <button
          onClick={() => onNavigate('wallet/cash-out')}
          className="flex flex-col items-center gap-1 group p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#e5eeff] text-[#004ac6] flex items-center justify-center shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">payments</span>
          </div>
          <span className="text-[12px] text-[#0b1c30] font-bold text-center leading-tight">
            Disburse
          </span>
          <span className="text-[10px] text-[#434655]">NG Banks</span>
        </button>

        {/* Action 4: Joint Vault */}
        <button
          onClick={() => onNavigate('joint')}
          className="flex flex-col items-center gap-1 group p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#dce9ff] text-[#004ac6] flex items-center justify-center shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">shield_lock</span>
          </div>
          <span className="text-[12px] text-[#0b1c30] font-bold text-center leading-tight">
            Joint Vaults
          </span>
          <span className="text-[10px] text-[#434655]">Multi-Sig 2/3</span>
        </button>
      </div>

      {/* Active Joint Accounts Preview Header & Carousel */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#0b1c30]">
              Active Joint Vaults
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#434655] text-[11px] font-semibold">
              {jointAccounts.length} Connected
            </span>
          </div>
          <button
            onClick={() => onNavigate('joint')}
            className="text-[12px] text-[#004ac6] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Accounts Content / Empty state */}
        {jointAccounts.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm border border-[#e5eeff]/60 flex flex-col items-center justify-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#e5eeff] text-[#004ac6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">shield_person</span>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#0b1c30]">No Joint Vaults Active</h3>
              <p className="text-[11px] text-[#737686] mt-0.5">
                Create a collaborative multi-sig vault for shared capital, co-signers, and consensus rules.
              </p>
            </div>
            <button
              onClick={() => onNavigate('joint')}
              className="px-4 py-1.5 rounded-xl bg-[#004ac6] text-white text-[12px] font-bold shadow-xs hover:bg-[#2563eb] cursor-pointer active:scale-95 transition-all"
            >
              Create Joint Vault
            </button>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {jointAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => onOpenVault(account.id)}
                className="flex-shrink-0 w-72 rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 flex flex-col justify-between gap-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#004ac6] text-[10px] font-bold">
                      {account.governanceRule} Quorum
                    </span>
                    <span className="material-symbols-outlined text-[#737686] text-[18px]">more_vert</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-8 h-8 rounded-xl bg-[#e5eeff] flex items-center justify-center text-[#004ac6] font-bold">
                      <span className="material-symbols-outlined text-[20px]">
                        {account.category === 'ventures' ? 'business_center' : 'villa'}
                      </span>
                    </div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30] truncate">
                      {account.name}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col bg-[#eff4ff] p-2.5 rounded-xl">
                  <span className="text-[11px] text-[#434655] font-medium">Vault Balance</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#0b1c30]">
                      {displayCurrency === 'NGN'
                        ? `₦${(account.balance * 1605.5).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
                        : `$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    </span>
                    <span className="text-[11px] text-[#434655]">{displayCurrency}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[#434655] pt-0.5">
                  <span className="text-[11px] font-medium">
                    {account.coOwnersCount} Co-owners • {account.contributorsCount || 0} Contributors
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Personal Transactions Section */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#0b1c30]">
              Recent Activity
            </h2>
            <span className="material-symbols-outlined text-[#737686] text-[18px]">tune</span>
          </div>
          <button
            onClick={() => onNavigate('activity')}
            className="text-[12px] text-[#004ac6] font-semibold hover:underline cursor-pointer"
          >
            Auditable Ledger
          </button>
        </div>

        {/* Transaction Ledger List Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5eeff]/60 overflow-hidden flex flex-col divide-y divide-[#eff4ff]">
          {transactions.length === 0 ? (
            <div className="p-6 text-center text-[#737686] flex flex-col items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[28px] text-[#737686]/50">receipt_long</span>
              <span className="text-[13px] font-medium text-[#0b1c30]">No activity recorded yet</span>
              <span className="text-[11px] text-[#737686]">Completed deposits, FX swaps, and disbursements will show here.</span>
            </div>
          ) : (
            transactions.slice(0, 4).map((tx) => (
              <div
                key={tx.id}
                onClick={() => onNavigate('activity')}
                className="flex items-center justify-between p-3.5 hover:bg-[#eff4ff]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'DEPOSIT'
                        ? 'bg-[#6ffbbe]/30 text-[#006242]'
                        : tx.type === 'FX_EXCHANGE'
                        ? 'bg-[#eff4ff] text-[#004ac6]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {tx.type === 'DEPOSIT'
                        ? 'arrow_downward'
                        : tx.type === 'FX_EXCHANGE'
                        ? 'sync_alt'
                        : 'arrow_upward'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-bold text-[#0b1c30] truncate">{tx.remark}</span>
                    </div>
                    <span className="text-[11px] text-[#434655] truncate">
                      {tx.tag || tx.accountName} • {tx.timeAgo || tx.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0 pl-2">
                  <span
                    className={`font-mono text-[14px] font-bold ${
                      tx.type === 'DEPOSIT' || tx.type === 'FX_EXCHANGE'
                        ? 'text-[#006242]'
                        : 'text-[#ba1a1a]'
                    }`}
                  >
                    {tx.type === 'WITHDRAWAL' ? '-' : '+'}
                    {displayCurrency === 'NGN'
                      ? `₦${(tx.amount * 1605.5).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
                      : `$${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.status === 'EXECUTED'
                        ? 'bg-[#6ffbbe]/40 text-[#002113]'
                        : tx.status === 'HELD_IN_ESCROW'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#dae2fd] text-[#131b2e]'
                    }`}
                  >
                    {tx.status === 'HELD_IN_ESCROW'
                      ? 'Escrow Review'
                      : tx.status === 'EXECUTED'
                      ? 'Settled'
                      : 'Pending Vote'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
