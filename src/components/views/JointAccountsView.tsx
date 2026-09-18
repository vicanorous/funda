import React, { useState } from 'react';
import { JointAccount } from '../../types';

interface JointAccountsViewProps {
  jointAccounts: JointAccount[];
  onOpenVault: (id: string) => void;
  onOpenWithdrawalReview: () => void;
  onOpenLedgerAudit: () => void;
  onOpenCreateModal: () => void;
  onDepositJoint: (vaultId: string) => void;
}

export const JointAccountsView: React.FC<JointAccountsViewProps> = ({
  jointAccounts,
  onOpenVault,
  onOpenWithdrawalReview,
  onOpenLedgerAudit,
  onOpenCreateModal,
  onDepositJoint,
}) => {
  const [filter, setFilter] = useState<'all' | 'co-owned' | 'contributor'>('all');
  const [alphaVoted, setAlphaVoted] = useState<'none' | 'signed' | 'rejected'>('none');

  const filteredAccounts = jointAccounts.filter((acc) => {
    if (filter === 'all') return true;
    if (filter === 'co-owned') return acc.category !== 'property';
    if (filter === 'contributor') return acc.category === 'property';
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Top Title & Governance Badge */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
            Governance Ledger
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#0b1c30]">
            Joint Accounts Hub
          </h1>
        </div>
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#e5eeff] rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#007d55] animate-pulse" />
          <span className="text-[11px] text-[#434655] font-bold">Multi-Sig 2/3</span>
        </div>
      </div>

      {/* Total Pooled Capital Hero Bento */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#d3e4fe]/40 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#737686] font-semibold">Total Pooled Capital</span>
            <span className="px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] text-[11px] font-bold">
              {jointAccounts.length} Active Vaults
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="font-['Plus_Jakarta_Sans'] text-[32px] text-[#0b1c30] font-extrabold tracking-tight">
              $64,700.00
            </span>
            <span className="text-[12px] text-[#006242] font-bold flex items-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> +8.4%
            </span>
          </div>

          {/* Pending Quorum Notice Strip */}
          <div className="flex items-center justify-between p-2.5 bg-[#ffdad6]/60 rounded-xl">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] flex-shrink-0">
                notifications_active
              </span>
              <span className="text-[12px] text-[#93000a] truncate font-semibold">
                2 withdrawal votes pending your quorum
              </span>
            </div>
            <button
              onClick={onOpenWithdrawalReview}
              className="flex-shrink-0 px-2.5 py-1 bg-white text-[#ba1a1a] text-[11px] font-bold rounded-lg shadow-xs hover:bg-[#ba1a1a] hover:text-white transition-colors cursor-pointer"
            >
              Review
            </button>
          </div>
        </div>
      </div>

      {/* Create New Joint Account CTA Button */}
      <button
        onClick={onOpenCreateModal}
        className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#004ac6] text-white rounded-xl shadow-md hover:bg-[#2563eb] active:scale-[0.99] transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">add_circle</span>
        <span className="text-[14px] font-bold tracking-wide">Create New Joint Account</span>
      </button>

      {/* Filter Tabs */}
      <div className="flex space-x-1.5 p-1 bg-[#e5eeff] rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center space-x-1 cursor-pointer ${
            filter === 'all'
              ? 'bg-white text-[#004ac6] shadow-xs'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          <span>All Accounts</span>
          <span className="w-4 h-4 rounded-full bg-[#e5eeff] text-[#434655] flex items-center justify-center text-[10px]">
            {jointAccounts.length}
          </span>
        </button>

        <button
          onClick={() => setFilter('co-owned')}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center space-x-1 cursor-pointer ${
            filter === 'co-owned'
              ? 'bg-white text-[#004ac6] shadow-xs'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          <span>Co-Owned</span>
          <span className="w-4 h-4 rounded-full bg-[#dce9ff] text-[#434655] flex items-center justify-center text-[10px]">
            2
          </span>
        </button>

        <button
          onClick={() => setFilter('contributor')}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center space-x-1 cursor-pointer ${
            filter === 'contributor'
              ? 'bg-white text-[#004ac6] shadow-xs'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          <span>Contributor</span>
          <span className="w-4 h-4 rounded-full bg-[#dce9ff] text-[#434655] flex items-center justify-center text-[10px]">
            1
          </span>
        </button>
      </div>

      {/* Account Cards List */}
      <div className="flex flex-col space-y-3.5">
        {/* Card 1: Alpha Ventures Operating */}
        {(filter === 'all' || filter === 'co-owned') && (
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div
                onClick={() => onOpenVault('vault_alpha_ventures')}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#dce9ff] flex items-center justify-center text-[#004ac6] flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
                </div>
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30] hover:text-[#004ac6] transition-colors">
                    Alpha Ventures Operating
                  </h2>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-[11px] text-[#737686]">Created Jan 12</span>
                    <span className="w-1 h-1 rounded-full bg-[#737686]" />
                    <span className="text-[11px] text-[#737686]">3 Co-Owners, 5 Contributors</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[11px] text-[#737686] font-medium">Pool Balance</span>
                <p className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#0b1c30]">
                  $42,500.00
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#004ac6] text-[11px] font-bold flex items-center space-x-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                <span>Co-Owner (2/3 Rights)</span>
              </span>
            </div>

            {/* Quorum Pending Vote Action Widget */}
            <div className="p-3 bg-[#dae2fd]/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#004ac6] animate-ping" />
                  <span className="text-[12px] text-[#0b1c30] font-bold">
                    Pending Withdrawal Vote
                  </span>
                </div>
                <span className="font-mono text-[14px] font-bold text-[#0b1c30]">$3,500.00</span>
              </div>

              <div className="flex items-center justify-between text-[12px] text-[#434655]">
                <span className="truncate">
                  Initiated by <strong>Marcus K.</strong>
                </span>
                <span className="text-[11px] text-[#004ac6] font-bold">
                  {alphaVoted === 'signed' ? '2 of 3 signed (Threshold Met)' : '1 of 3 signed'}
                </span>
              </div>

              <div className="w-full bg-[#dce9ff] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#004ac6] h-full rounded-full transition-all duration-300"
                  style={{ width: alphaVoted === 'signed' ? '66.6%' : '33%' }}
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                {alphaVoted === 'none' ? (
                  <>
                    <button
                      onClick={() => setAlphaVoted('rejected')}
                      className="px-3 py-1 bg-white text-[#434655] hover:text-[#ba1a1a] rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setAlphaVoted('signed');
                        onOpenWithdrawalReview();
                      }}
                      className="px-3 py-1 bg-[#004ac6] text-white rounded-lg text-[11px] font-bold hover:bg-[#2563eb] shadow-xs transition-colors cursor-pointer"
                    >
                      Authorize (Sign)
                    </button>
                  </>
                ) : alphaVoted === 'signed' ? (
                  <span className="text-[11px] font-bold text-[#006242] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Your signature sealed
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-[#ba1a1a]">Vote Rejected</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Card 2: Family Property Maintenance */}
        {(filter === 'all' || filter === 'contributor') && (
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div
                onClick={() => onOpenVault('vault_family_property')}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#dce9ff] flex items-center justify-center text-[#565e74] flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">domain</span>
                </div>
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
                    Family Property Maintenance
                  </h2>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-[11px] text-[#737686]">Created Feb 04</span>
                    <span className="w-1 h-1 rounded-full bg-[#737686]" />
                    <span className="text-[11px] text-[#737686]">2 Co-Owners, 4 Contributors</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[11px] text-[#737686] font-medium">Pool Balance</span>
                <p className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#0b1c30]">
                  $18,200.00
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#dce9ff] text-[#434655] text-[11px] font-bold flex items-center space-x-1">
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                <span>Contributor (Deposit Only)</span>
              </span>
            </div>

            <div className="p-2.5 bg-[#eff4ff] rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#006242] text-[18px]">
                  verified
                </span>
                <span className="text-[12px] text-[#0b1c30] font-medium">
                  All withdrawals approved &amp; reconciled
                </span>
              </div>
              <button
                onClick={() => onDepositJoint('vault_family_property')}
                className="px-3 py-1 bg-white text-[#004ac6] text-[11px] font-bold rounded-lg shadow-xs hover:bg-[#e5eeff] transition-colors cursor-pointer"
              >
                Deposit
              </button>
            </div>
          </div>
        )}

        {/* Card 3: Emergency Community Pool */}
        {(filter === 'all' || filter === 'co-owned') && (
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div
                onClick={() => onOpenVault('vault_emergency_pool')}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#dce9ff] flex items-center justify-center text-[#004ac6] flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
                </div>
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
                    Emergency Community Pool
                  </h2>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-[11px] text-[#737686]">Created Mar 18</span>
                    <span className="w-1 h-1 rounded-full bg-[#737686]" />
                    <span className="text-[11px] text-[#737686]">3 Co-Owners, 8 Contributors</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[11px] text-[#737686] font-medium">Pool Balance</span>
                <p className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#0b1c30]">
                  $4,000.00
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#004ac6] text-[11px] font-bold flex items-center space-x-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                <span>Co-Owner</span>
              </span>
            </div>

            <div className="p-2.5 bg-[#ffdad6]/40 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">flag</span>
                <span className="text-[12px] text-[#93000a] font-bold">
                  Unknown depositor flagged ($650.00)
                </span>
              </div>
              <button
                onClick={onOpenLedgerAudit}
                className="px-2.5 py-1 bg-white text-[#ba1a1a] text-[11px] font-bold rounded-lg shadow-xs hover:bg-[#ba1a1a] hover:text-white transition-colors cursor-pointer"
              >
                Audit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Permission Architecture Card */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
            Permission Architecture
          </h3>
          <span className="material-symbols-outlined text-[#737686] text-[18px]">info</span>
        </div>
        <p className="text-[12px] text-[#434655] leading-relaxed">
          Institutional cryptographic rules apply to all pooled reserves. Privileges are strictly
          partitioned by account roles:
        </p>

        <div className="grid grid-cols-1 gap-2.5 pt-1">
          {/* Co-Owner Block */}
          <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#004ac6] text-[11px] font-bold">
                Co-Owner
              </span>
              <span className="text-[13px] text-[#0b1c30] font-bold">Consensus Participant</span>
            </div>
            <ul className="space-y-1 text-[12px] text-[#434655] pl-1">
              <li className="flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-[#007d55] text-[15px]">
                  check_circle
                </span>
                <span>Vote on and authorize withdrawal proposals (2/3 quorum)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-[#007d55] text-[15px]">
                  check_circle
                </span>
                <span>Invite and designate co-owners or contributors</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-[#007d55] text-[15px]">
                  check_circle
                </span>
                <span>Modify governance rules and quorum threshold</span>
              </li>
            </ul>
          </div>

          {/* Contributor Block */}
          <div className="p-3 rounded-xl bg-[#eff4ff] space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#434655] text-[11px] font-bold">
                Contributor
              </span>
              <span className="text-[13px] text-[#0b1c30] font-bold">Observer &amp; Funder</span>
            </div>
            <ul className="space-y-1 text-[12px] text-[#434655] pl-1">
              <li className="flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-[#007d55] text-[15px]">
                  check_circle
                </span>
                <span>Deposit capital into pooled accounts</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-[#007d55] text-[15px]">
                  check_circle
                </span>
                <span>View immutable verified ledger &amp; audit trails in real time</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[15px]">cancel</span>
                <span className="text-[#737686]">
                  Cannot initiate or authorize pool withdrawals
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pollar Core Ledger Seal */}
      <div className="p-3 rounded-xl bg-[#e5eeff] flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#004ac6] flex-shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
        </div>
        <p className="text-[12px] text-[#434655]">
          Every transaction is permanently recorded with encrypted cryptographic signatures on
          Pollar Core Ledger.
        </p>
      </div>
    </div>
  );
};
