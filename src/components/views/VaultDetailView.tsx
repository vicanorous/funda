import React, { useState } from 'react';
import { Transaction } from '../../types';

interface VaultDetailViewProps {
  onBack: () => void;
  onViewLedger: () => void;
  onVoteDecision?: (txId: string, decision: 'APPROVED' | 'REJECTED') => void;
}

export const VaultDetailView: React.FC<VaultDetailViewProps> = ({
  onBack,
  onViewLedger,
  onVoteDecision,
}) => {
  const [decisionState, setDecisionState] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleDecision = (choice: 'approved' | 'rejected') => {
    setDecisionState(choice);
    if (onVoteDecision) {
      onVoteDecision('tx_aws_hosting', choice === 'approved' ? 'APPROVED' : 'REJECTED');
    }
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Context Card: Treasury Scope & Meta Tag */}
      <div className="bg-[#e5eeff] rounded-2xl p-4 shadow-sm border border-[#dce9ff]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#004ac6]">
              assured_workload
            </span>
            <span className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
              Lagos Tech Ventures OpEx
            </span>
          </div>
          <div className="bg-[#dae2fd] text-[#5c647a] px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">enhanced_encryption</span>
            <span className="font-mono text-[11px] font-bold">#WD-8492</span>
          </div>
        </div>

        {/* Amount Display & Payout Channel */}
        <div className="mt-2 flex flex-col items-center justify-center text-center py-2">
          <span className="text-[12px] text-[#434655] font-medium">Proposed Outflow Amount</span>
          <div className="font-['Plus_Jakarta_Sans'] text-[34px] font-extrabold text-[#0b1c30] tracking-tight mt-0.5 flex items-baseline">
            <span className="text-[22px] text-[#434655] mr-1 font-medium">$</span>
            <span>3,500.00</span>
            <span className="text-[13px] text-[#434655] ml-1.5 font-semibold">USD</span>
          </div>
          <span className="text-[12px] text-[#007d55] font-semibold">
            ≈ ₦5,619,250.00 NGN @ 1,605.50
          </span>
          <div className="mt-2 flex items-center gap-1.5 bg-[#dce9ff] px-3 py-1 rounded-full text-[#434655]">
            <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
              account_balance
            </span>
            <span className="text-[12px] font-semibold">
              Disburse: GTBank Corporate <span className="font-mono">****4812</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Remark Card (Verified Proof) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#004ac6]/5 rounded-full pointer-events-none" />

        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5 text-[#004ac6]">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="text-[11px] uppercase font-bold tracking-wide">Mandatory Remark</span>
          </div>
          <span className="text-[11px] bg-[#007d55]/15 text-[#006242] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">gavel</span> Audit Bound
          </span>
        </div>

        {/* Quote Bubble Box */}
        <div className="mt-1 bg-[#eff4ff] rounded-xl p-3 flex gap-2 items-start">
          <span className="material-symbols-outlined text-[20px] text-[#004ac6]/70 shrink-0 select-none">
            format_quote
          </span>
          <p className="text-[13px] text-[#0b1c30] italic leading-snug">
            Payment for Q3 Server Infrastructure &amp; Cloud Gateway hosting invoice{' '}
            <span className="font-mono font-bold text-[#004ac6]">#INV-9921</span>
          </p>
        </div>

        {/* Proposer Info Strip */}
        <div className="mt-2 flex items-center justify-between pt-1 text-[#434655]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#004ac6] text-white flex items-center justify-center shrink-0 text-[11px] font-bold">
              VN
            </div>
            <div className="truncate flex items-center">
              <span className="text-[12px] text-[#0b1c30] font-bold">Victor Nwoguji</span>
              <span className="text-[10px] text-[#004ac6] bg-[#d3e4fe] px-1.5 py-0.2 rounded-full ml-1.5 font-bold">
                Treasury Lead
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-[#737686]">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            <span className="text-[12px]">2h ago</span>
          </div>
        </div>
      </div>

      {/* Multi-Signature Consensus Tracker (2 of 3) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#004ac6]">policy</span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#0b1c30] font-bold">
              Multi-Sig Consensus
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#004ac6] bg-[#dbe1ff] px-2 py-0.5 rounded-full">
            Quorum: 2 of 3
          </span>
        </div>

        <div className="space-y-2">
          {/* Signer 1: Victor Nwoguji */}
          <div className="p-2.5 rounded-xl bg-[#eff4ff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006242] text-[18px]">
                check_circle
              </span>
              <div>
                <span className="font-bold text-[13px] text-[#0b1c30] block">Victor Nwoguji</span>
                <span className="text-[10px] text-[#737686]">Co-Owner • Signer 1</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#006242] bg-[#6ffbbe]/40 px-2 py-0.5 rounded-full">
              Approved
            </span>
          </div>

          {/* Signer 2: Sarah Chen (You) */}
          <div className="p-2.5 rounded-xl bg-white border border-[#e5eeff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#004ac6] text-[18px]">
                hourglass_top
              </span>
              <div>
                <span className="font-bold text-[13px] text-[#0b1c30] block">Sarah Chen (You)</span>
                <span className="text-[10px] text-[#737686]">Co-Owner • Signer 2</span>
              </div>
            </div>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                decisionState === 'approved'
                  ? 'bg-[#6ffbbe]/40 text-[#006242]'
                  : decisionState === 'rejected'
                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                  : 'bg-[#dae2fd] text-[#131b2e]'
              }`}
            >
              {decisionState === 'approved'
                ? 'Approved'
                : decisionState === 'rejected'
                ? 'Rejected'
                : 'Awaiting Signature'}
            </span>
          </div>

          {/* Signer 3: Marcus Kelly */}
          <div className="p-2.5 rounded-xl bg-[#f8f9ff] flex items-center justify-between opacity-70">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#737686] text-[18px]">pending</span>
              <div>
                <span className="font-bold text-[13px] text-[#0b1c30] block">Marcus Kelly</span>
                <span className="text-[10px] text-[#737686]">Co-Owner • Signer 3</span>
              </div>
            </div>
            <span className="text-[11px] text-[#737686]">Standby</span>
          </div>
        </div>
      </div>

      {/* Decision Voting Actions */}
      {decisionState === 'pending' ? (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleDecision('rejected')}
            className="py-3 px-4 rounded-xl border border-[#ba1a1a] text-[#ba1a1a] font-bold text-[14px] hover:bg-[#ffdad6]/40 active:scale-95 transition-all cursor-pointer"
          >
            Reject Withdrawal
          </button>
          <button
            onClick={() => handleDecision('approved')}
            className="py-3 px-4 rounded-xl bg-[#004ac6] text-white font-bold text-[14px] shadow-md hover:bg-[#2563eb] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>Authorize Sign</span>
          </button>
        </div>
      ) : (
        <div className="p-3.5 bg-[#eff4ff] rounded-2xl border border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[20px] ${
                decisionState === 'approved' ? 'text-[#006242]' : 'text-[#ba1a1a]'
              }`}
            >
              {decisionState === 'approved' ? 'task_alt' : 'cancel'}
            </span>
            <span className="font-bold text-[13px] text-[#0b1c30]">
              {decisionState === 'approved'
                ? 'Your vote was cryptographically recorded & dispatched.'
                : 'You have recorded a rejection on this proposal.'}
            </span>
          </div>
          <button
            onClick={onViewLedger}
            className="text-[12px] text-[#004ac6] font-bold hover:underline cursor-pointer"
          >
            View Ledger
          </button>
        </div>
      )}
    </div>
  );
};
