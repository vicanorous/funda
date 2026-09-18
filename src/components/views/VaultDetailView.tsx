import React, { useState } from 'react';

interface VaultDetailViewProps {
  onBack: () => void;
  onViewLedger: () => void;
}

export const VaultDetailView: React.FC<VaultDetailViewProps> = ({ onBack, onViewLedger }) => {
  const [decisionState, setDecisionState] = useState<'pending' | 'approved' | 'rejected'>('pending');

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
              Alpha Ventures Operating
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
            <span>6,450.00</span>
            <span className="text-[13px] text-[#434655] ml-1.5 font-semibold">USD</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 bg-[#dce9ff] px-3 py-1 rounded-full text-[#434655]">
            <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
              account_balance
            </span>
            <span className="text-[12px] font-semibold">
              Off-ramp: J.P. Morgan Chase <span className="font-mono">****4812</span>
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
            Payment for Q3 Server Infrastructure &amp; AWS Cloud hosting invoice{' '}
            <span className="font-mono font-bold text-[#004ac6]">#INV-9921</span>
          </p>
        </div>

        {/* Proposer Info Strip */}
        <div className="mt-2 flex items-center justify-between pt-1 text-[#434655]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#dae2fd] flex items-center justify-center shrink-0">
              <span className="text-[11px] text-[#131b2e] font-bold">MK</span>
            </div>
            <div className="truncate flex items-center">
              <span className="text-[12px] text-[#0b1c30] font-bold">Marcus Kelly</span>
              <span className="text-[10px] text-[#004ac6] bg-[#d3e4fe] px-1.5 py-0.2 rounded-full ml-1.5 font-bold">
                Initiator
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
          <span className="bg-[#004ac6]/10 text-[#004ac6] font-mono font-bold text-[12px] px-2 py-0.5 rounded-full">
            2 / 3 Required
          </span>
        </div>

        {/* Progress Meter */}
        <div className="w-full bg-[#e5eeff] rounded-full h-2.5 overflow-hidden flex">
          <div
            className="bg-[#006242] h-full transition-all duration-500 rounded-full"
            style={{ width: decisionState === 'approved' ? '100%' : '66.6%' }}
          />
          {decisionState !== 'approved' && <div className="bg-[#004ac6]/20 h-full flex-1" />}
        </div>

        <div className="flex justify-between items-center text-[#434655]">
          <span className="text-[11px] font-bold text-[#006242] flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            {decisionState === 'approved'
              ? '100% Consensus Sealed'
              : '66% Consensus Achieved'}
          </span>
          <span className="text-[11px] text-[#737686]">
            {decisionState === 'approved' ? 'Threshold Met' : 'Final Signer Needed'}
          </span>
        </div>

        {/* Signers Linear List */}
        <div className="space-y-2 pt-1">
          {/* 1. Marcus Kelly */}
          <div className="flex items-center justify-between p-2 bg-[#eff4ff] rounded-xl">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-[11px] font-bold">
                  MK
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#006242] rounded-full flex items-center justify-center ring-2 ring-white">
                  <span className="material-symbols-outlined text-[10px] text-white">check</span>
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[#0b1c30] font-bold">Marcus Kelly</div>
                <div className="text-[10px] text-[#434655]">Co-Owner • Signer 1</div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-[#e5eeff] px-2 py-0.5 rounded-full text-[#006242]">
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              <span className="text-[11px] font-bold">Approved</span>
            </div>
          </div>

          {/* 2. Sarah Chen */}
          <div className="flex items-center justify-between p-2 bg-[#eff4ff] rounded-xl">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-[11px] font-bold">
                  SC
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#006242] rounded-full flex items-center justify-center ring-2 ring-white">
                  <span className="material-symbols-outlined text-[10px] text-white">check</span>
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[#0b1c30] font-bold">Sarah Chen</div>
                <div className="text-[10px] text-[#434655]">Co-Owner • Signer 2</div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-[#e5eeff] px-2 py-0.5 rounded-full text-[#006242]">
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              <span className="text-[11px] font-bold">Approved</span>
            </div>
          </div>

          {/* 3. Alex Vance (Current User) */}
          <div className="flex items-center justify-between p-2 bg-[#d3e4fe]/40 rounded-xl shadow-xs border border-[#2563eb]/20">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center text-[11px] font-bold">
                  AV
                </div>
                {decisionState === 'approved' ? (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#006242] rounded-full flex items-center justify-center ring-2 ring-white">
                    <span className="material-symbols-outlined text-[10px] text-white">check</span>
                  </div>
                ) : (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#ba1a1a] rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    <span className="material-symbols-outlined text-[10px] text-white">
                      priority_high
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="text-[12px] text-[#0b1c30] font-bold flex items-center gap-1">
                  You (Alex Vance)
                  <span className="text-[10px] text-[#004ac6] font-bold">(Actionable)</span>
                </div>
                <div className="text-[10px] text-[#434655]">Co-Owner • Signer 3</div>
              </div>
            </div>

            {decisionState === 'approved' ? (
              <div className="flex items-center gap-1 bg-[#e5eeff] px-2 py-0.5 rounded-full text-[#006242]">
                <span className="material-symbols-outlined text-[14px]">done_all</span>
                <span className="text-[11px] font-bold">Approved</span>
              </div>
            ) : decisionState === 'rejected' ? (
              <div className="flex items-center gap-1 bg-[#ffdad6] px-2 py-0.5 rounded-full text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[14px]">cancel</span>
                <span className="text-[11px] font-bold">Rejected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-[#d3e4fe] px-2 py-0.5 rounded-full text-[#ba1a1a] font-bold">
                <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                <span className="text-[10px]">Pending Decision</span>
              </div>
            )}
          </div>
        </div>

        {/* Governance Notice */}
        <div className="bg-[#eff4ff] rounded-xl p-2.5 flex items-start gap-2 text-[#434655]">
          <span className="material-symbols-outlined text-[16px] text-[#565e74] mt-0.5 shrink-0">
            info
          </span>
          <p className="text-[11px] leading-snug">
            Contributors (5 members) have transaction visibility but cannot approve or reject this
            withdrawal.
          </p>
        </div>
      </div>

      {/* Interactive Action Execution Module */}
      {decisionState === 'pending' ? (
        <div className="flex flex-col space-y-2 pt-1">
          <button
            onClick={() => setDecisionState('approved')}
            className="w-full bg-[#004ac6] hover:bg-[#2563eb] active:scale-[0.98] text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer font-bold text-[14px]"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>Approve Withdrawal (Execute)</span>
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to formally reject Proposal #WD-8492? This action will immediately void the smart contract disbursement.',
                )
              ) {
                setDecisionState('rejected');
              }
            }}
            className="w-full bg-[#e5eeff] text-[#ba1a1a] hover:bg-[#ffdad6] active:scale-[0.98] py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-[14px]"
          >
            <span className="material-symbols-outlined text-[20px]">cancel</span>
            <span>Reject Proposal</span>
          </button>
        </div>
      ) : decisionState === 'approved' ? (
        <div className="bg-[#007d55] text-white rounded-2xl p-4 flex flex-col items-center text-center space-y-2 shadow-md animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-white text-[#007d55] flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[28px]">lock_open</span>
          </div>
          <div className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold">
            Withdrawal Dispatched
          </div>
          <p className="text-[12px] text-white/90">
            Consensus 3 of 3 sealed. Ledger settlement scheduled with J.P. Morgan Chase.
          </p>
          <button
            onClick={onViewLedger}
            className="mt-2 px-4 py-1.5 bg-white text-[#006242] rounded-xl text-[12px] font-bold cursor-pointer hover:bg-white/90"
          >
            View in Auditable Ledger
          </button>
        </div>
      ) : (
        <div className="bg-[#ffdad6] text-[#93000a] p-4 rounded-2xl text-center flex flex-col items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-[28px] text-[#ba1a1a]">block</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#ba1a1a]">
            Proposal Rejected
          </span>
          <span className="text-[12px] text-[#93000a]/90">
            You have voided this disbursement request. Formal rejection broadcast to co-owners.
          </span>
        </div>
      )}

      {/* Security Audit Footer */}
      <div className="flex items-center justify-center gap-1.5 py-1 text-[#737686]">
        <span className="material-symbols-outlined text-[16px] text-[#006242]">shield</span>
        <span className="text-[12px] font-medium">
          Powered by <span className="font-bold text-[#0b1c30]">Pollar</span> smart escrow ledger
          stamp
        </span>
      </div>
    </div>
  );
};
