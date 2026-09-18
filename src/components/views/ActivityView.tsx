import React, { useState } from 'react';
import { Transaction } from '../../types';

interface ActivityViewProps {
  transactions: Transaction[];
  onOpenMerkleProof: (txHash?: string) => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  transactions,
  onOpenMerkleProof,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPill, setFilterPill] = useState<'all' | 'deposits' | 'cashout' | 'fx' | 'joint'>(
    'all',
  );

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

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Settled Velocity & Merkle Tree Sync Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#737686] font-semibold">Settled Velocity (30D)</span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e5eeff] text-[#004ac6] text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] animate-pulse" />
            <span>Merkle Block #19,842,109</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[20px] text-[#434655] font-semibold">$</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold text-[#0b1c30]">
              18,450.00
            </span>
            <span className="text-[12px] text-[#434655] font-semibold">USD</span>
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
        {/* Today Group */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#737686] uppercase tracking-wider px-1">
            Today
          </span>
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5eeff]/60 divide-y divide-[#eff4ff] overflow-hidden">
            {/* 1. FX Swap */}
            <div
              onClick={() => onOpenMerkleProof('0x3a91...44f2')}
              className="p-3.5 flex items-center justify-between hover:bg-[#eff4ff]/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6ffbbe]/30 text-[#006242] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[14px] text-[#0b1c30]">Converted USD to HKD</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#6ffbbe] text-[#002113] text-[9px] font-bold">
                      FX Stamp
                    </span>
                  </div>
                  <span className="text-[11px] text-[#434655]">1 USD = 7.8214 HKD • 14:20</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[14px] font-bold text-[#006242]">
                  +HK$ 15,642.80
                </span>
                <span className="text-[10px] text-[#006242] block font-semibold">Completed</span>
              </div>
            </div>

            {/* 2. Bank Wire Deposit */}
            <div
              onClick={() => onOpenMerkleProof('0x4e11...9b23')}
              className="p-3.5 flex items-center justify-between hover:bg-[#eff4ff]/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[14px] text-[#0b1c30]">Bank Deposit (ACH)</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#434655] text-[9px] font-semibold">
                      Standard Chartered
                    </span>
                  </div>
                  <span className="text-[11px] text-[#434655]">Wire Reference FD-V9941 • 11:05</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[14px] font-bold text-[#0b1c30]">+$2,500.00</span>
                <span className="text-[10px] text-[#004ac6] block font-semibold flex items-center gap-0.5 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] animate-ping" />
                  <span>Processing</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Yesterday Group */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#737686] uppercase tracking-wider px-1">
            Yesterday
          </span>
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5eeff]/60 divide-y divide-[#eff4ff] overflow-hidden">
            {/* 3. Joint Contribution */}
            <div
              onClick={() => onOpenMerkleProof('0x8f2a...7c91')}
              className="p-3.5 flex items-center justify-between hover:bg-[#eff4ff]/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e5eeff] text-[#737686] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">arrow_outward</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[14px] text-[#0b1c30]">Contribution: House Fund</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#dbe1ff] text-[#004ac6] text-[9px] font-bold">
                      Joint Vault
                    </span>
                  </div>
                  <span className="text-[11px] text-[#434655]">Direct Internal • 18:42</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[14px] font-bold text-[#0b1c30]">-$1,200.00</span>
                <span className="text-[10px] text-[#006242] block font-semibold">Completed</span>
              </div>
            </div>

            {/* 4. AWS Server Outflow */}
            <div
              onClick={() => onOpenMerkleProof('0x992b...e4a8')}
              className="p-3.5 flex items-center justify-between hover:bg-[#eff4ff]/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">cloud_queue</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[14px] text-[#0b1c30]">AWS Cloud Hosting</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#434655] text-[9px] font-semibold">
                      Alpha Ventures
                    </span>
                  </div>
                  <span className="text-[11px] text-[#434655]">Invoice #INV-9921 • Multi-sig</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[14px] font-bold text-[#ba1a1a]">-$6,450.00</span>
                <span className="text-[10px] text-[#006242] block font-semibold">Consensus Sealed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Merkle-Proof Certified Audit Footer Badge */}
      <div
        onClick={() => onOpenMerkleProof()}
        className="p-4 rounded-2xl bg-[#e5eeff] space-y-2 cursor-pointer hover:bg-[#dce9ff] transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[20px]">verified</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#0b1c30]">
              Merkle-Proof Certified Audit
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#004ac6] flex items-center gap-0.5">
            <span>Verify</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </span>
        </div>
        <p className="text-[11px] text-[#434655] leading-relaxed">
          Every transaction in this ledger contains a verifiable SHA-256 Merkle root hash anchored
          to Pollar Validator Node #07.
        </p>
      </div>
    </div>
  );
};
