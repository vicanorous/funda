import React, { useState } from 'react';
import { JointAccount, Transaction } from '../../types';

interface VaultDetailViewProps {
  vault?: JointAccount;
  pendingTx?: Transaction;
  displayCurrency?: 'USD' | 'NGN';
  onBack: () => void;
  onViewLedger: () => void;
  onDeposit?: (vaultId: string) => void;
  onVoteDecision?: (txId: string, decision: 'APPROVED' | 'REJECTED') => void;
}

export const VaultDetailView: React.FC<VaultDetailViewProps> = ({
  vault,
  pendingTx,
  displayCurrency = 'USD',
  onBack,
  onViewLedger,
  onDeposit,
  onVoteDecision,
}) => {
  const [decisionState, setDecisionState] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const formatAmount = (usdVal: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(usdVal * 1605.5).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
    }
    return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const handleDecision = (choice: 'approved' | 'rejected') => {
    setDecisionState(choice);
    if (onVoteDecision && pendingTx) {
      onVoteDecision(pendingTx.id, choice === 'approved' ? 'APPROVED' : 'REJECTED');
    }
  };

  if (!vault && !pendingTx) {
    return (
      <div className="flex flex-col w-full space-y-4">
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#004ac6] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#0b1c30]">
            Vault Details
          </h1>
        </div>
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-[#e5eeff]/60 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e5eeff] text-[#004ac6] flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">shield</span>
          </div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
            No Vault Selected
          </h3>
          <p className="text-[12px] text-[#737686] max-w-xs">
            Select a multi-sig vault from the Joint Accounts Hub to view consensus details or initiate actions.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#004ac6] text-white text-[13px] font-bold rounded-xl shadow-xs hover:bg-[#2563eb] cursor-pointer transition-all"
          >
            Back to Joint Accounts
          </button>
        </div>
      </div>
    );
  }

  const vaultName = vault?.name || pendingTx?.accountName || 'Joint Multi-Sig Vault';
  const vaultId = vault?.pollarWalletId || 'Consensus Vault';
  const quorum = vault?.governanceRule || 'Multi-Sig 2/3';
  const balance = vault?.balance || 0;

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#004ac6] cursor-pointer hover:bg-[#dce9ff] transition-all"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#0b1c30]">
              {vaultName}
            </h1>
            <span className="text-[11px] text-[#737686]">{vaultId}</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#dae2fd] text-[#131b2e] text-[11px] font-bold">
          {quorum} Quorum
        </span>
      </div>

      {/* Vault Balance Bento */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[#d3e4fe]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
            Vault Treasury Balance
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold text-[#0b1c30]">
              {formatAmount(balance)}
            </span>
            <span className="text-[12px] text-[#434655] font-semibold">{displayCurrency}</span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-[#eff4ff]">
            {vault && onDeposit && (
              <button
                onClick={() => onDeposit(vault.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#004ac6] text-white text-[12px] font-bold hover:bg-[#2563eb] cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add_card</span>
                <span>Deposit to Vault</span>
              </button>
            )}
            <button
              onClick={onViewLedger}
              className="flex-1 py-2 px-3 rounded-xl bg-[#e5eeff] text-[#004ac6] text-[12px] font-bold hover:bg-[#dce9ff] cursor-pointer transition-all flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>Audit Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Proposal Section (if one genuinely exists) */}
      {pendingTx ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
              Pending Multi-Sig Proposal
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold uppercase">
              Vote Required
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-[#737686]">Proposed Outflow</span>
                <div className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold text-[#ba1a1a]">
                  -{formatAmount(pendingTx.amount)}
                </div>
              </div>
              <span className="font-mono text-[11px] text-[#737686] bg-[#eff4ff] px-2 py-1 rounded-lg">
                #{pendingTx.ledgerNumber || 'WD'}
              </span>
            </div>

            {pendingTx.remark && (
              <div className="p-3 bg-[#eff4ff] rounded-xl text-[12px] text-[#0b1c30]">
                <span className="font-semibold block text-[#434655] text-[10px] uppercase mb-0.5">
                  Remark / Reason:
                </span>
                {pendingTx.remark}
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-[#737686] pt-1">
              <span>Initiated By: {pendingTx.initiatorName || 'Co-Owner'}</span>
              <span>{pendingTx.timeAgo || pendingTx.createdAt || 'Recent'}</span>
            </div>

            {decisionState === 'pending' ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleDecision('rejected')}
                  className="py-2.5 px-3 rounded-xl border border-[#ba1a1a] text-[#ba1a1a] font-bold text-[13px] hover:bg-[#ffdad6]/40 active:scale-95 transition-all cursor-pointer"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDecision('approved')}
                  className="py-2.5 px-3 rounded-xl bg-[#004ac6] text-white font-bold text-[13px] shadow-sm hover:bg-[#2563eb] active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Authorize Sign</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-[#eff4ff] rounded-xl text-center text-[12px] font-bold text-[#006242]">
                {decisionState === 'approved'
                  ? 'Vote recorded as Approved and dispatched to network.'
                  : 'Proposal Rejected.'}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff]/60 space-y-2">
          <div className="flex items-center gap-2 text-[#006242]">
            <span className="material-symbols-outlined text-[20px]">verified</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold">
              Consensus Vault in Good Standing
            </span>
          </div>
          <p className="text-[12px] text-[#737686] leading-relaxed">
            There are currently no pending outflow proposals requiring your multi-sig signature. All historic disbursements are settled on the auditable ledger.
          </p>
        </div>
      )}

      {/* Governance Rules Strip */}
      <div className="p-4 rounded-2xl bg-[#e5eeff] space-y-1.5">
        <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#0b1c30] block">
          Consensus Rules &amp; Co-Signers
        </span>
        <p className="text-[11px] text-[#434655] leading-relaxed">
          This vault enforces {quorum} multi-signature consensus before any outbound disbursement or token bridge is executed.
        </p>
        <div className="flex items-center justify-between text-[11px] font-bold text-[#004ac6] pt-1">
          <span>{vault?.coOwnersCount || 2} Co-Owners Configured</span>
          <span>{vault?.contributorsCount || 0} Contributors</span>
        </div>
      </div>
    </div>
  );
};
