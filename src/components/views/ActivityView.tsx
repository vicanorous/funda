import React, { useState } from 'react';
import { Transaction } from '../../types';

interface ActivityViewProps {
  transactions: Transaction[];
  displayCurrency?: 'USD' | 'NGN';
  onOpenMerkleProof: (txHash?: string) => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  transactions,
  displayCurrency = 'USD',
  onOpenMerkleProof,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPill, setFilterPill] = useState<'all' | 'deposits' | 'cashout' | 'fx' | 'joint'>('all');

  const handleDownloadCsv = () => {
    const csvHeader = 'Date,Type,Amount,Currency,Remark,Hash,Status\n';
    const csvRows = transactions
      .map(
        (t) =>
          `"${t.createdAt}","${t.type}","${t.amount}","${t.currency}","${t.remark}","${t.txHash}","${t.status}"`,
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `funda_ledger_statement_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = transactions.filter((t) => {
    if (filterPill === 'deposits' && t.type !== 'DEPOSIT') return false;
    if (filterPill === 'cashout' && t.type !== 'WITHDRAWAL') return false;
    if (filterPill === 'fx' && t.type !== 'FX_EXCHANGE') return false;
    if (filterPill === 'joint' && !t.accountName?.toLowerCase().includes('joint') && !t.accountName?.toLowerCase().includes('vault')) {
      if (filterPill === 'joint') return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.remark?.toLowerCase().includes(q) ||
        t.txHash?.toLowerCase().includes(q) ||
        t.accountName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatTxAmount = (amountUsd: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUsd * 1605.5).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
    }
    return `$${amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Settled Velocity & Merkle Tree Sync Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#737686] font-semibold">Settled Velocity (30D)</span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e5eeff] text-[#004ac6] text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] animate-pulse" />
            <span>Pollar Block #19,842,109</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold text-[#0b1c30]">
              {formatTxAmount(18450)}
            </span>
            <span className="text-[12px] text-[#434655] font-semibold">{displayCurrency}</span>
          </div>
          <span className="text-[12px] text-[#006242] font-bold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+14.2%</span>
          </span>
        </div>
      </div>

      {/* Search & Export Actions Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-xs border border-[#e5eeff]">
          <span className="material-symbols-outlined text-[18px] text-[#737686]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchant, memo, reference..."
            className="w-full text-[13px] text-[#0b1c30] outline-none bg-transparent"
          />
        </div>
        <button
          onClick={handleDownloadCsv}
          className="px-3 py-2 bg-[#e5eeff] text-[#004ac6] rounded-xl font-bold text-[12px] flex items-center gap-1 hover:bg-[#dce9ff] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>CSV</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
        {[
          { id: 'all', label: 'All Transactions' },
          { id: 'deposits', label: 'On-Ramp Deposits' },
          { id: 'cashout', label: 'Cash Out' },
          { id: 'fx', label: 'FX Exchanges' },
          { id: 'joint', label: 'Joint Contributions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterPill(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterPill === tab.id
                ? 'bg-[#004ac6] text-white shadow-xs'
                : 'bg-white text-[#434655] border border-[#e5eeff] hover:bg-[#eff4ff]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date-Grouped Transaction Stream */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#737686] uppercase tracking-wider px-1">
            Transaction Activity ({filtered.length})
          </span>
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5eeff]/60 divide-y divide-[#eff4ff] overflow-hidden">
            {filtered.map((tx) => (
              <div
                key={tx.id}
                onClick={() => onOpenMerkleProof(tx.txHash)}
                className="p-3.5 flex items-center justify-between hover:bg-[#eff4ff]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
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
                        ? 'south_west'
                        : tx.type === 'FX_EXCHANGE'
                        ? 'sync_alt'
                        : 'arrow_outward'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[14px] text-[#0b1c30]">{tx.remark}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          tx.type === 'FX_EXCHANGE'
                            ? 'bg-[#6ffbbe] text-[#002113]'
                            : tx.type === 'DEPOSIT'
                            ? 'bg-[#dbe1ff] text-[#004ac6]'
                            : 'bg-[#eff4ff] text-[#434655]'
                        }`}
                      >
                        {tx.tag || tx.type}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#434655]">
                      {tx.accountName} • {tx.createdAt}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono text-[14px] font-bold ${
                      tx.type === 'DEPOSIT' || tx.type === 'FX_EXCHANGE'
                        ? 'text-[#006242]'
                        : 'text-[#ba1a1a]'
                    }`}
                  >
                    {tx.type === 'WITHDRAWAL' ? '-' : '+'}
                    {formatTxAmount(tx.amount)}
                  </span>
                  <span
                    className={`text-[10px] block font-semibold ${
                      tx.status === 'EXECUTED'
                        ? 'text-[#006242]'
                        : tx.status === 'HELD_IN_ESCROW'
                        ? 'text-[#ba1a1a]'
                        : 'text-[#004ac6]'
                    }`}
                  >
                    {tx.status === 'EXECUTED'
                      ? 'Completed'
                      : tx.status === 'HELD_IN_ESCROW'
                      ? 'Escrow Locked'
                      : 'Pending Vote'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
