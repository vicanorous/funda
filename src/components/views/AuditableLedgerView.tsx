import React, { useState } from 'react';
import { Transaction } from '../../types';

interface AuditableLedgerViewProps {
  transactions?: Transaction[];
  displayCurrency?: 'USD' | 'NGN';
  onOpenMerkleProof: (txHash?: string) => void;
  onOpenDepositResolution?: () => void;
}

export const AuditableLedgerView: React.FC<AuditableLedgerViewProps> = ({
  transactions = [],
  displayCurrency = 'USD',
  onOpenMerkleProof,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'deposits' | 'withdrawals'>('all');

  const totalDeposits = transactions
    .filter((t) => t.status === 'EXECUTED' && t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter((t) => t.status === 'EXECUTED' && t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + t.amount, 0);
  const netLedgerBalance = Math.max(totalDeposits - totalWithdrawals, 0);

  const formatAmount = (usdVal: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(usdVal * 1605.5).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
    }
    return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return t.status === 'PENDING' || t.status === 'HELD_IN_ESCROW';
    if (filter === 'deposits') return t.type === 'DEPOSIT';
    if (filter === 'withdrawals') return t.type === 'WITHDRAWAL';
    return true;
  });

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Treasury Ledger Summary Bento */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[#d3e4fe]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
                Immutable Ledger
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#004ac6] text-[10px] font-bold">
                Treasury Audit
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#737686]">
              {transactions.length} Recorded {transactions.length === 1 ? 'Event' : 'Events'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold text-[#0b1c30]">
                {formatAmount(netLedgerBalance)}
              </span>
              <span className="text-[12px] text-[#434655] font-semibold">{displayCurrency}</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#007d55]/15 text-[#006242]">
              Cryptographic Consensus
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#eff4ff]">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#737686]">Total Verified Inflow</span>
              <span className="font-mono text-[13px] font-bold text-[#006242]">
                +{formatAmount(totalDeposits)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#737686]">Total Verified Outflow</span>
              <span className="font-mono text-[13px] font-bold text-[#ba1a1a]">
                -{formatAmount(totalWithdrawals)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auditable Ledger Header & Merkle Root Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#0b1c30]">
            Auditable Ledger
          </h2>
          <span className="text-[11px] text-[#737686]">Pollar verified consensus events</span>
        </div>
        <button
          onClick={() => onOpenMerkleProof()}
          className="flex items-center gap-1 px-3 py-1 bg-[#e5eeff] text-[#004ac6] text-[11px] font-bold rounded-xl hover:bg-[#dce9ff] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">shield</span>
          <span>Verify Merkle Root</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1.5 p-1 bg-[#e5eeff] rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-white text-[#004ac6] shadow-xs'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          All Logs ({transactions.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            filter === 'pending'
              ? 'bg-white text-[#004ac6] shadow-xs'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('deposits')}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            filter === 'deposits'
              ? 'bg-white text-[#004ac6] shadow-xs'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          Deposits
        </button>
        <button
          onClick={() => setFilter('withdrawals')}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            filter === 'withdrawals'
              ? 'bg-white text-[#004ac6] shadow-xs'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          Withdrawals
        </button>
      </div>

      {/* Ledger Cards */}
      <div className="flex flex-col space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-[#e5eeff]/60 flex flex-col items-center justify-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-[#e5eeff] text-[#004ac6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">history_toggle_off</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
                No Ledger Transactions
              </h3>
              <p className="text-[12px] text-[#737686] mt-1 max-w-xs mx-auto">
                Transactions executed across your personal wallet and joint vaults will be chronologically indexed here.
              </p>
            </div>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border space-y-2.5 ${
                tx.status === 'PENDING'
                  ? 'border-l-4 border-l-[#2563eb] border-[#e5eeff]/60'
                  : tx.status === 'HELD_IN_ESCROW'
                  ? 'border-[#ffdad6]'
                  : 'border-[#e5eeff]/60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
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
                  <div className="min-w-0">
                    <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30] truncate">
                      {tx.remark || (tx.type === 'DEPOSIT' ? 'Deposit' : tx.type === 'FX_EXCHANGE' ? 'FX Swap' : 'Disbursement')}
                    </h3>
                    <span className="text-[11px] text-[#737686] truncate block">
                      {tx.tag || tx.accountName || 'Treasury'} • {tx.timeAgo || tx.createdAt || 'Recent'}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-2">
                  <span
                    className={`font-mono text-[15px] font-bold ${
                      tx.type === 'DEPOSIT' || tx.type === 'FX_EXCHANGE'
                        ? 'text-[#006242]'
                        : 'text-[#ba1a1a]'
                    }`}
                  >
                    {tx.type === 'WITHDRAWAL' ? '-' : '+'}
                    {formatAmount(tx.amount)}
                  </span>
                  <div className="flex items-center justify-end gap-1 text-[10px] font-bold mt-0.5">
                    <span
                      className={`px-2 py-0.2 rounded-full ${
                        tx.status === 'EXECUTED'
                          ? 'bg-[#6ffbbe]/40 text-[#002113]'
                          : tx.status === 'HELD_IN_ESCROW'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#dae2fd] text-[#131b2e]'
                      }`}
                    >
                      {tx.status === 'EXECUTED'
                        ? 'EXECUTED'
                        : tx.status === 'HELD_IN_ESCROW'
                        ? 'ESCROW'
                        : 'PENDING VOTE'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#eff4ff] text-[11px] text-[#434655] space-y-1">
                {tx.initiatorName && (
                  <div className="flex justify-between">
                    <span>Initiated By:</span>
                    <span className="font-semibold text-[#0b1c30]">{tx.initiatorName}</span>
                  </div>
                )}
                {tx.txHash && (
                  <div className="flex justify-between">
                    <span>Transaction Hash:</span>
                    <button
                      onClick={() => onOpenMerkleProof(tx.txHash)}
                      className="font-mono text-[#004ac6] hover:underline cursor-pointer"
                    >
                      {tx.txHash}
                    </button>
                  </div>
                )}
                {tx.ledgerNumber && (
                  <div className="flex justify-between">
                    <span>Ledger Index:</span>
                    <span className="font-mono font-bold text-[#0b1c30]">#{tx.ledgerNumber}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cryptographically Audited Footer Badge */}
      <div className="p-4 rounded-2xl bg-[#e5eeff] space-y-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6] text-[20px]">verified</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#0b1c30]">
            Cryptographically Audited
          </span>
        </div>
        <p className="text-[12px] text-[#434655] leading-relaxed">
          Entries are verified on the Pollar settlement protocol with cryptographic consensus signatures.
        </p>
        <button
          onClick={() => onOpenMerkleProof()}
          className="text-[12px] font-bold text-[#004ac6] hover:underline flex items-center gap-0.5 cursor-pointer pt-1"
        >
          <span>View Raw Merkle Proof</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
