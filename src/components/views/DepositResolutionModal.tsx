import React, { useState } from 'react';

interface DepositResolutionModalProps {
  onClose: () => void;
  onResolved: (role: 'CONTRIBUTOR' | 'CO_OWNER', memo: string) => void;
}

export const DepositResolutionModal: React.FC<DepositResolutionModalProps> = ({
  onClose,
  onResolved,
}) => {
  const [selectedRole, setSelectedRole] = useState<'CONTRIBUTOR' | 'CO_OWNER'>('CONTRIBUTOR');
  const [memo, setMemo] = useState('Verified identity via consulting agreement #AGR-442');

  const handleConfirm = () => {
    onResolved(selectedRole, memo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 rounded-full bg-[#c3c6d7] mx-auto sm:hidden" />

        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#0b1c30]">
              Resolve Depositor Status
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#737686] hover:text-[#0b1c30] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-3 bg-[#eff4ff] rounded-2xl text-[12px] space-y-1">
          <div className="flex justify-between font-bold text-[#0b1c30]">
            <span>Depositor:</span>
            <span>Emeka K. Obi</span>
          </div>
          <div className="flex justify-between text-[#434655]">
            <span>Incoming Transfer:</span>
            <span className="font-mono font-bold text-[#006242]">+$1,200.00 USD (≈ ₦1,926,600)</span>
          </div>
          <div className="flex justify-between text-[#434655]">
            <span>Bank Source:</span>
            <span>Providus Bank • 9902****12</span>
          </div>
        </div>

        <div className="space-y-2 text-[13px]">
          <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block">
            Designate Membership Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('CONTRIBUTOR')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                selectedRole === 'CONTRIBUTOR'
                  ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                  : 'bg-white border-[#e5eeff]'
              }`}
            >
              <span className="text-[13px] font-bold text-[#0b1c30] block">Contributor</span>
              <span className="text-[10px] text-[#737686]">Funder &amp; Observer (Recommended)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('CO_OWNER')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                selectedRole === 'CO_OWNER'
                  ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                  : 'bg-white border-[#e5eeff]'
              }`}
            >
              <span className="text-[13px] font-bold text-[#0b1c30] block">Co-Owner</span>
              <span className="text-[10px] text-[#737686]">Quorum &amp; Voting Signer</span>
            </button>
          </div>
        </div>

        <div className="space-y-1 text-[13px]">
          <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block">
            Mandatory Consensus Memo
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#c3c6d7] focus:border-[#004ac6] outline-none text-[#0b1c30]"
          />
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-3 bg-[#004ac6] text-white font-bold rounded-xl text-[14px] hover:bg-[#2563eb] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Admit to Vault &amp; Release Funds</span>
        </button>
      </div>
    </div>
  );
};
