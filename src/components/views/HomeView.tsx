import React, { useState } from 'react';
import { JointAccount } from '../../types';

interface HomeViewProps {
  jointAccounts: JointAccount[];
  onNavigate: (route: string) => void;
  onOpenVault: (vaultId: string) => void;
  onOpenWithdrawalReview: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  jointAccounts,
  onNavigate,
  onOpenVault,
  onOpenWithdrawalReview,
}) => {
  const [balanceMode, setBalanceMode] = useState<'personal' | 'joint'>('personal');

  const personalBalance = '14,250.00';
  const jointShareBalance = '32,800.00';

  return (
    <div className="flex flex-col w-full gap-4 pb-12">
      {/* Top Section: Total Net Worth Card (Cobalt Gradient with Interactive Toggle) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#004ac6] via-[#2563eb] to-[#0053db] p-4 shadow-md text-white">
        {/* Ambient organic glow background decor */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#d3e4fe]/20 blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-[#dbe1ff]/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80 font-['Inter']">
              Combined Treasury Balance
            </span>
            <div className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-md">
              <span className="inline-block w-2 h-2 rounded-full bg-[#6ffbbe] animate-pulse" />
              <span className="text-[11px] text-white font-medium">
                Live FX: 1 USD ≈ 7.82 HKD
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
              <span>Personal Wallet</span>
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
              <span>Joint Share</span>
            </button>
          </div>

          {/* Primary Balance Display */}
          <div className="flex flex-col pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] font-medium text-white/70 font-['Plus_Jakarta_Sans']">$</span>
              <h1 className="text-[34px] font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                {balanceMode === 'personal' ? personalBalance : jointShareBalance}
              </h1>
              <span className="text-[13px] text-white/75 font-semibold uppercase tracking-wide">
                USD
              </span>
            </div>

            <div className="text-[13px] text-white/80 flex items-center gap-1.5 mt-0.5">
              {balanceMode === 'personal' ? (
                <>
                  <span>≈ HK$ 111,435.00 available</span>
                  <span className="text-[11px] font-semibold bg-[#007d55]/40 px-1.5 py-0.2 rounded text-[#bdffdb]">
                    +2.4% yield
                  </span>
                </>
              ) : (
                <>
                  <span>Across 2 active shared vaults</span>
                  <span className="text-[11px] font-semibold bg-white/30 px-1.5 py-0.2 rounded text-white">
                    Multi-sig Protected
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Safe Audit Meta */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-white/85">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="text-[11px] font-medium">FDIC Insured Custody • Multi-sig</span>
            </div>
            <span className="font-mono text-[12px] text-white/80 font-medium">Ref #FD-9941</span>
          </div>
        </div>
      </div>

      {/* Priority Multi-sig Action Alert Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-[#ffdad6] text-[#93000a] shadow-sm gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#ba1a1a] flex-shrink-0 shadow-sm mt-0.5">
            <span className="material-symbols-outlined text-[20px]">gavel</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#93000a]">
                1 Pending Joint Approval
              </span>
              <span className="bg-[#ba1a1a] text-white text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-full">
                Requires Signature
              </span>
            </div>
            <p className="text-[12px] text-[#93000a]/90 truncate mt-0.5">
              Logistics Reserve: $4,200.00 withdrawal needs your vote
            </p>
          </div>
        </div>

        <button
          onClick={onOpenWithdrawalReview}
          className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-[#004ac6] text-white text-[12px] font-bold shadow-sm hover:bg-[#2563eb] transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
        >
          <span>Review &amp; Sign</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* Quick Actions Row (4 Circular cobalt-accented buttons) */}
      <div className="grid grid-cols-4 gap-2">
        {/* Action 1: Fund Wallet */}
        <button
          onClick={() => onNavigate('wallet/fund')}
          className="flex flex-col items-center gap-1 group p-2 rounded-2xl hover:bg-[#eff4ff] transition-all cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-md group-hover:scale-105 group-active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">add_card</span>
          </div>
          <span className="text-[12px] text-[#0b1c30] font-bold text-center leading-tight">
            Fund Wallet
          </span>
          <span className="text-[10px] text-[#434655]">On-Ramp</span>
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
            Exchange
          </span>
          <span className="text-[10px] text-[#006242] font-semibold">0.12% Spread</span>
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
            Cash Out
          </span>
          <span className="text-[10px] text-[#434655]">Bank Payout</span>
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
            Joint Vault
          </span>
          <span className="text-[10px] text-[#434655]">Multi-sig</span>
        </button>
      </div>

      {/* Active Joint Accounts Preview Header & Carousel */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#0b1c30]">
              Active Joint Accounts
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#434655] text-[11px] font-semibold">
              {jointAccounts.length} Connected
            </span>
          </div>
          <button
            onClick={() => onNavigate('joint')}
            className="text-[12px] text-[#004ac6] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Manage All</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Accounts Horizontal Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {/* Card 1: House Expansion Fund */}
          <div
            onClick={() => onOpenVault('vault_alpha_ventures')}
            className="flex-shrink-0 w-72 rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 flex flex-col justify-between gap-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#004ac6] text-[11px] font-bold">
                  Your Role: Co-Owner
                </span>
                <span className="material-symbols-outlined text-[#737686] text-[18px]">more_vert</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-8 h-8 rounded-xl bg-[#e5eeff] flex items-center justify-center text-[#004ac6] font-bold">
                  <span className="material-symbols-outlined text-[20px]">villa</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30] truncate">
                  House Expansion Fund
                </h3>
              </div>
            </div>

            <div className="flex flex-col bg-[#eff4ff] p-2.5 rounded-xl">
              <span className="text-[11px] text-[#434655] font-medium">Vault Balance</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#0b1c30]">
                  $48,500.00
                </span>
                <span className="text-[11px] text-[#434655]">USD</span>
              </div>
              <span className="font-mono text-[12px] text-[#006242] font-semibold flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                <span>$4,100 funded this cycle</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[#434655] pt-0.5">
              <div className="flex items-center -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                  AL
                </div>
                <div className="w-6 h-6 rounded-full bg-[#006242] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                  MR
                </div>
                <div className="w-6 h-6 rounded-full bg-[#cbdbf5] text-[#0b1c30] flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                  +5
                </div>
              </div>
              <span className="text-[11px] font-medium">3 Co-owners • 4 Contributors</span>
            </div>
          </div>

          {/* Card 2: Dev Studio OpEx */}
          <div
            onClick={() => onOpenVault('vault_family_property')}
            className="flex-shrink-0 w-72 rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 flex flex-col justify-between gap-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#3f465c] text-[11px] font-bold">
                  Your Role: Contributor
                </span>
                <span className="material-symbols-outlined text-[#737686] text-[18px]">more_vert</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-8 h-8 rounded-xl bg-[#e5eeff] flex items-center justify-center text-[#004ac6] font-bold">
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30] truncate">
                  Dev Studio OpEx
                </h3>
              </div>
            </div>

            <div className="flex flex-col bg-[#eff4ff] p-2.5 rounded-xl">
              <span className="text-[11px] text-[#434655] font-medium">Vault Balance</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#0b1c30]">
                  $16,200.00
                </span>
                <span className="text-[11px] text-[#434655]">USD</span>
              </div>
              <span className="font-mono text-[12px] text-[#737686] font-semibold flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">history</span>
                <span>Last distribution 2d ago</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[#434655] pt-0.5">
              <div className="flex items-center -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-[#565e74] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                  TK
                </div>
                <div className="w-6 h-6 rounded-full bg-[#dce9ff] text-[#0b1c30] flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                  JD
                </div>
              </div>
              <span className="text-[11px] font-medium">2 Co-owners</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Personal Transactions Section */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#0b1c30]">
              Recent Activity
            </h2>
            <span className="material-symbols-outlined text-[#737686] text-[18px]">tune</span>
          </div>
          <button
            onClick={() => onNavigate('activity')}
            className="text-[12px] text-[#004ac6] font-semibold hover:underline cursor-pointer"
          >
            Download CSV
          </button>
        </div>

        {/* Transaction Ledger List Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5eeff]/60 overflow-hidden flex flex-col divide-y divide-[#eff4ff]">
          {/* Item 1: Completed FX Conversion */}
          <div
            onClick={() => onNavigate('wallet/exchange')}
            className="flex items-center justify-between p-3.5 hover:bg-[#eff4ff]/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#6ffbbe]/30 text-[#006242] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">sync_alt</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#0b1c30] truncate">
                    Converted USD to HKD
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#6ffbbe] text-[#002113] text-[10px] font-bold">
                    FX Stamp
                  </span>
                </div>
                <span className="text-[12px] text-[#434655] truncate">
                  Rate: 1 USD = 7.8214 HKD • Today, 14:20
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end flex-shrink-0 pl-2">
              <span className="font-mono text-[15px] font-bold text-[#006242]">
                +HK$ 15,642.80
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#002113] text-[11px] font-bold">
                Completed
              </span>
            </div>
          </div>

          {/* Item 2: Processing On-Ramp */}
          <div
            onClick={() => onNavigate('wallet/fund')}
            className="flex items-center justify-between p-3.5 bg-[#eff4ff]/30 hover:bg-[#eff4ff]/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#0b1c30] truncate">
                    Bank Deposit (ACH / FPS)
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#434655] text-[10px] font-semibold">
                    Local Wire
                  </span>
                </div>
                <span className="text-[12px] text-[#434655] truncate">
                  Standard Chartered • Today, 11:05
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end flex-shrink-0 pl-2">
              <span className="font-mono text-[15px] font-bold text-[#0b1c30]">+$2,500.00</span>
              <span className="px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] text-[11px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] animate-ping" />
                <span>Processing</span>
              </span>
            </div>
          </div>

          {/* Item 3: Withdrawal to Joint Account */}
          <div
            onClick={() => onNavigate('joint')}
            className="flex items-center justify-between p-3.5 hover:bg-[#eff4ff]/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#e5eeff] text-[#737686] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">arrow_outward</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#0b1c30] truncate">
                    Contribution: House Fund
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#dbe1ff] text-[#004ac6] text-[10px] font-bold">
                    Joint Multi-sig
                  </span>
                </div>
                <span className="text-[12px] text-[#434655] truncate">
                  Direct Internal • Yesterday, 18:42
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end flex-shrink-0 pl-2">
              <span className="font-mono text-[15px] font-bold text-[#0b1c30]">-$1,200.00</span>
              <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#002113] text-[11px] font-bold">
                Completed
              </span>
            </div>
          </div>

          {/* Item 4: Cloud Infrastructure Payout */}
          <div
            onClick={() => onOpenVault('vault_alpha_ventures')}
            className="flex items-center justify-between p-3.5 hover:bg-[#eff4ff]/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#e5eeff] text-[#737686] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">cloud_queue</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#0b1c30] truncate">
                    AWS Multi-Region Cluster
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#434655] text-[10px] font-semibold">
                    Vendor
                  </span>
                </div>
                <span className="text-[12px] text-[#434655] truncate">
                  Dev Studio OpEx Split • Oct 24
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end flex-shrink-0 pl-2">
              <span className="font-mono text-[15px] font-bold text-[#0b1c30]">-$384.50</span>
              <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#002113] text-[11px] font-bold">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
