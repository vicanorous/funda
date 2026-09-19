import React, { useState } from 'react';
import { JointAccount } from '../../types';

interface JointAccountsViewProps {
  jointAccounts: JointAccount[];
  displayCurrency?: 'USD' | 'NGN';
  onOpenVault: (id: string) => void;
  onOpenWithdrawalReview: () => void;
  onOpenLedgerAudit: () => void;
  onOpenCreateModal: () => void;
  onDepositJoint: (vaultId: string) => void;
}

export const JointAccountsView: React.FC<JointAccountsViewProps> = ({
  jointAccounts,
  displayCurrency = 'USD',
  onOpenVault,
  onOpenWithdrawalReview,
  onOpenLedgerAudit,
  onOpenCreateModal,
  onDepositJoint,
}) => {
  const [filter, setFilter] = useState<'all' | 'co-owned' | 'contributor'>('all');
  const [alphaVoted, setAlphaVoted] = useState<'none' | 'signed' | 'rejected'>('none');

  const totalPooledUsd = jointAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const filteredAccounts = jointAccounts.filter((acc) => {
    if (filter === 'all') return true;
    if (filter === 'co-owned') return acc.category !== 'property';
    if (filter === 'contributor') return acc.category === 'property';
    return true;
  });

  const formatVaultAmount = (amountUsd: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUsd * 1605.5).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
    }
    return `$${amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Top Title & Governance Badge */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
            Governance &amp; Multi-Sig Hub
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#0b1c30]">
            Joint Accounts Hub
          </h1>
        </div>
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#e5eeff] rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#007d55] animate-pulse" />
          <span className="text-[11px] text-[#434655] font-bold">Consensus Governance</span>
        </div>
      </div>

      {/* Total Pooled Capital Hero Bento */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#d3e4fe]/40 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#737686] font-semibold">Total Pooled Capital</span>
            <span className="px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] text-[11px] font-bold">
              {jointAccounts.length} Active {jointAccounts.length === 1 ? 'Vault' : 'Vaults'}
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="font-['Plus_Jakarta_Sans'] text-[32px] text-[#0b1c30] font-extrabold tracking-tight">
              {formatVaultAmount(totalPooledUsd)}
            </span>
          </div>
        </div>
      </div>

      {/* Create New Joint Account CTA Button */}
      <button
        onClick={onOpenCreateModal}
        className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#004ac6] text-white rounded-xl shadow-md hover:bg-[#2563eb] active:scale-[0.99] transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">add_circle</span>
        <span className="text-[14px] font-bold tracking-wide">Create New Multi-Sig Vault</span>
      </button>

      {/* Filter Tabs */}
      <div className="flex space-x-1.5 p-1 bg-[#e5eeff] rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1 px-2 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            filter === 'all' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655]'
          }`}
        >
          All Vaults ({jointAccounts.length})
        </button>
        <button
          onClick={() => setFilter('co-owned')}
          className={`flex-1 py-1 px-2 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            filter === 'co-owned' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655]'
          }`}
        >
          Co-Owned
        </button>
        <button
          onClick={() => setFilter('contributor')}
          className={`flex-1 py-1 px-2 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            filter === 'contributor' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655]'
          }`}
        >
          Contributor
        </button>
      </div>

      {/* Accounts List */}
      <div className="space-y-3">
        {filteredAccounts.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-[#e5eeff]/60 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#e5eeff] text-[#004ac6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
                No Joint Vaults Found
              </h3>
              <p className="text-[12px] text-[#737686] mt-1 max-w-xs mx-auto">
                No active shared vaults match this filter. Create a new multi-sig vault to pool treasury capital.
              </p>
            </div>
            <button
              onClick={onOpenCreateModal}
              className="mt-1 px-4 py-2 bg-[#004ac6] text-white text-[13px] font-bold rounded-xl shadow-xs hover:bg-[#2563eb] cursor-pointer active:scale-95 transition-all"
            >
              Create Vault Now
            </button>
          </div>
        ) : (
          filteredAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#e5eeff] text-[#004ac6] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">
                      {account.category === 'ventures' ? 'business_center' : 'villa'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
                      {account.name}
                    </h3>
                    <span className="text-[11px] text-[#737686]">
                      {account.governanceRule} Quorum • {account.pollarWalletId}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#004ac6] text-[10px] font-bold">
                  {account.category === 'property' ? 'Contributor' : 'Co-Owner'}
                </span>
              </div>

              <div className="bg-[#eff4ff] p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#737686] block">Vault Balance</span>
                  <span className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold text-[#0b1c30]">
                    {formatVaultAmount(account.balance)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDepositJoint(account.id)}
                    className="px-3 py-1.5 bg-white hover:bg-[#dce9ff] text-[#004ac6] text-[12px] font-bold rounded-lg shadow-2xs cursor-pointer transition-colors"
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => onOpenVault(account.id)}
                    className="px-3 py-1.5 bg-[#004ac6] hover:bg-[#2563eb] text-white text-[12px] font-bold rounded-lg shadow-2xs cursor-pointer transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#434655] pt-0.5">
                <span>
                  {account.coOwnersCount} Co-Owners • {account.contributorsCount || 0} Contributors
                </span>
                <button
                  onClick={onOpenLedgerAudit}
                  className="text-[#004ac6] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Audit Trail</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
