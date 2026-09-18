import React, { useState } from 'react';
import { Transaction } from '../../types';

interface AuditableLedgerViewProps {
  transactions: Transaction[];
  onOpenMerkleProof: (txHash?: string) => void;
  onOpenDepositResolution: () => void;
}

export const AuditableLedgerView: React.FC<AuditableLedgerViewProps> = ({
  transactions,
  onOpenMerkleProof,
  onOpenDepositResolution,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'deposits' | 'withdrawals'>('all');
  const [contractorSigned, setContractorSigned] = useState(false);
  const [unknownResolved, setUnknownResolved] = useState<'pending' | 'contributor' | 'refunded'>(
    'pending',
  );

  const filtered = transactions.filter((tx) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return tx.status === 'PENDING';
    if (filter === 'deposits') return tx.type === 'DEPOSIT';
    if (filter === 'withdrawals') return tx.type === 'WITHDRAWAL';
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-16 space-y-4">
      {/* Unknown Depositor Detected ACTION REQUIRED Banner */}
      {unknownResolved === 'pending' ? (
        <div className="rounded-2xl p-4 bg-[#ffdad6] text-[#93000a] shadow-sm border border-[#ba1a1a]/20 space-y-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-[#ba1a1a] flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold">
                  Unknown Depositor Detected
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[10px] font-extrabold uppercase tracking-wide">
                  Action Required
                </span>
              </div>
              <p className="text-[12px] text-[#93000a]/90 leading-relaxed mt-1">
                External transfer of <strong>$1,200.00</strong> received from unverified account
                holder <strong>David O. Miller</strong> (Barclays ****1104). Pending depositors
                cannot view shared vault ledger until approved by consensus.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#ba1a1a]/15">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Initiate immediate reverse wire refund of $1,200.00 back to Barclays ****1104?',
                  )
                ) {
                  setUnknownResolved('refunded');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-white text-[#ba1a1a] font-bold text-[12px] hover:bg-[#ba1a1a] hover:text-white transition-colors cursor-pointer"
            >
              Refund Deposit
            </button>
            <button
              onClick={() => {
                onOpenDepositResolution();
                setUnknownResolved('contributor');
              }}
              className="px-4 py-1.5 rounded-xl bg-[#004ac6] text-white font-bold text-[12px] hover:bg-[#2563eb] shadow-sm transition-colors cursor-pointer"
            >
              Add Contributor
            </button>
          </div>
        </div>
      ) : unknownResolved === 'contributor' ? (
        <div className="p-3 bg-[#6ffbbe]/30 text-[#002113] rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006242] text-[20px]">
              check_circle
            </span>
            <span className="text-[12px] font-bold">
              David O. Miller verified and added as Contributor
            </span>
          </div>
          <span className="text-[10px] text-[#006242] font-semibold">Ledger access granted</span>
        </div>
      ) : (
        <div className="p-3 bg-[#e5eeff] text-[#004ac6] rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">undo</span>
            <span className="text-[12px] font-bold">Deposit $1,200.00 refunded to Barclays ****1104</span>
          </div>
          <span className="text-[10px] font-semibold">Escrow closed</span>
        </div>
      )}

      {/* Multi-Sig Joint Vault #04 Header Bento */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-[#e5eeff]/60">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[#d3e4fe]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
                Multi-Sig Joint Vault #04
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#004ac6] text-[10px] font-bold">
                Alpha Ventures
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#737686]">plr_vault_01_alpha</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] text-[#434655] font-semibold">$</span>
              <span className="font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold text-[#0b1c30]">
                42,500.00
              </span>
              <span className="text-[12px] text-[#434655] font-semibold">USD</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#007d55]/15 text-[#006242]">
              2/3 Quorum Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#eff4ff]">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#737686]">24h Inflow</span>
              <span className="font-mono text-[13px] font-bold text-[#006242]">+$16,200.00</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#737686]">24h Outflow</span>
              <span className="font-mono text-[13px] font-bold text-[#ba1a1a]">-$6,450.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auditable Ledger Header & Merkle Root Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#0b1c30]">
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
          All Logs (4)
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            filter === 'pending'
              ? 'bg-white text-[#004ac6] shadow-xs'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          Pending Votes (2)
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

      {/* Ledger Cards Matching Screen 4 */}
      <div className="flex flex-col space-y-3">
        {/* Item 1: AWS Hosting Q3 */}
        {(filter === 'all' || filter === 'withdrawals') && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#e5eeff] text-[#004ac6] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">cloud</span>
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
                    AWS Hosting Q3
                  </h3>
                  <span className="text-[11px] text-[#737686]">Infrastructure • Ref: INV-9921</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[16px] font-bold text-[#ba1a1a]">-$6,450.00</span>
                <div className="flex items-center justify-end gap-1 text-[10px] text-[#006242] font-bold">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  <span>EXECUTED</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#eff4ff] text-[11px] text-[#434655] space-y-1">
              <div className="flex justify-between">
                <span>Co-Signers:</span>
                <span className="font-semibold text-[#0b1c30]">Marcus K., Sarah C. (2/3)</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Hash:</span>
                <button
                  onClick={() => onOpenMerkleProof('0x8f2a...7c91')}
                  className="font-mono text-[#004ac6] hover:underline cursor-pointer"
                >
                  0x8f2a...7c91
                </button>
              </div>
              <div className="flex justify-between">
                <span>Ledger Index:</span>
                <span className="font-mono font-bold text-[#0b1c30]">#4092</span>
              </div>
            </div>
          </div>
        )}

        {/* Item 2: Local Currency On-Ramp */}
        {(filter === 'all' || filter === 'deposits') && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#6ffbbe]/30 text-[#006242] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">south_west</span>
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
                    Local Currency On-Ramp
                  </h3>
                  <span className="text-[11px] text-[#737686]">EUR to USD via Pollar</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[16px] font-bold text-[#006242]">+$15,000.00</span>
                <div className="flex items-center justify-end gap-1 text-[10px] text-[#006242] font-bold">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  <span>VERIFIED</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#eff4ff] text-[11px] text-[#434655] space-y-1">
              <div className="flex justify-between">
                <span>Verified Depositor:</span>
                <span className="font-semibold text-[#0b1c30]">Sarah Chen (Co-Owner)</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Hash:</span>
                <button
                  onClick={() => onOpenMerkleProof('0x4e11...9b23')}
                  className="font-mono text-[#004ac6] hover:underline cursor-pointer"
                >
                  0x4e11...9b23
                </button>
              </div>
              <div className="flex justify-between">
                <span>Ledger Index:</span>
                <span className="font-mono font-bold text-[#0b1c30]">#4091</span>
              </div>
            </div>
          </div>
        )}

        {/* Item 3: Contractor Payout (Pending Vote) */}
        {(filter === 'all' || filter === 'pending' || filter === 'withdrawals') && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-2.5 border-l-4 border-l-[#2563eb]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#dae2fd] text-[#004ac6] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
                    Contractor Payout
                  </h3>
                  <span className="text-[11px] text-[#737686]">Product Design Sprint</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[16px] font-bold text-[#0b1c30]">-$2,100.00</span>
                <div className="flex items-center justify-end gap-1 text-[10px] text-[#004ac6] font-bold">
                  <span className="material-symbols-outlined text-[12px]">hourglass_empty</span>
                  <span>PENDING VOTE</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#eff4ff] text-[11px] text-[#434655] space-y-1">
              <div className="flex justify-between">
                <span>Multi-Sig Progress:</span>
                <span className="font-semibold text-[#004ac6]">
                  {contractorSigned ? '2/2 Signed (Met)' : '1/2 Signed (Marcus Kelly)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Recipient:</span>
                <span className="text-[#0b1c30]">Studio Apex Design LLC</span>
              </div>
            </div>

            {!contractorSigned ? (
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => alert('Proposal rejected and notification sent.')}
                  className="px-3 py-1 bg-white text-[#434655] hover:text-[#ba1a1a] rounded-lg text-[11px] font-bold border border-[#e5eeff] cursor-pointer"
                >
                  Reject
                </button>
                <button
                  onClick={() => setContractorSigned(true)}
                  className="px-3 py-1 bg-[#004ac6] text-white rounded-lg text-[11px] font-bold hover:bg-[#2563eb] shadow-xs cursor-pointer"
                >
                  Sign &amp; Authorize
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-1.5 bg-[#6ffbbe]/30 text-[#002113] rounded-xl text-[11px] font-bold gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#006242]">
                  check_circle
                </span>
                <span>Signature Submitted • Broadcasted to Network</span>
              </div>
            )}
          </div>
        )}

        {/* Item 4: Unknown Depositor Escrow Lock */}
        {(filter === 'all' || filter === 'deposits') && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#ffdad6] space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">lock_person</span>
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
                    David O. Miller
                  </h3>
                  <span className="text-[11px] text-[#ba1a1a] font-semibold">
                    Held in escrow • Pending KYC
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[16px] font-bold text-[#ba1a1a]">+$1,200.00</span>
                <div className="flex items-center justify-end gap-1 text-[10px] text-[#ba1a1a] font-bold">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  <span>ESCROW LOCK</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#ffdad6]/40 text-[11px] text-[#93000a] space-y-1">
              <div className="flex justify-between">
                <span>Originating Bank:</span>
                <span className="font-semibold">Barclays ****1104</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Condition:</span>
                <span>Requires Co-Owner Verification Vote</span>
              </div>
            </div>
          </div>
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
          Every entry in this vault corresponds to an immutable Pollar node hash with 2/3 multi-sig
          consensus verification.
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
