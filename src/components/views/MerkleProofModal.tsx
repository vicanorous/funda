import React, { useState } from 'react';

interface MerkleProofModalProps {
  txHash?: string;
  onClose: () => void;
}

export const MerkleProofModal: React.FC<MerkleProofModalProps> = ({ txHash, onClose }) => {
  const [copied, setCopied] = useState(false);
  const rootHash = '0x7f9a12c8b0932847a9ecf744e99a19c5b46e3304d1c1a2fe9200fa827dbac991';

  const handleCopy = () => {
    navigator.clipboard?.writeText(rootHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Handle for Mobile */}
        <div className="w-10 h-1 rounded-full bg-[#c3c6d7] mx-auto sm:hidden" />

        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[24px]">verified</span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#0b1c30]">
              Pollar Merkle Proof Receipt
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#737686] hover:text-[#0b1c30] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-3 text-[12px]">
          <div className="p-3 bg-[#eff4ff] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#737686] uppercase font-bold tracking-wider block">
              Cryptographic Merkle Root
            </span>
            <p className="font-mono text-[11px] text-[#0b1c30] break-all select-all font-semibold">
              {rootHash}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-[#eff4ff] rounded-xl">
              <span className="text-[10px] text-[#737686] uppercase font-semibold block">
                Merkle Block
              </span>
              <span className="font-mono font-bold text-[#0b1c30] text-[13px]">#19,842,109</span>
            </div>
            <div className="p-2.5 bg-[#eff4ff] rounded-xl">
              <span className="text-[10px] text-[#737686] uppercase font-semibold block">
                Consensus Finality
              </span>
              <span className="text-[#006242] font-bold text-[12px] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>SEALED (2/3)</span>
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-[#eff4ff] rounded-xl flex justify-between items-center">
            <span className="text-[#737686]">Validator Node:</span>
            <span className="font-semibold text-[#0b1c30]">Pollar Node #07 (Frankfurt)</span>
          </div>

          {txHash && (
            <div className="p-2.5 bg-[#eff4ff] rounded-xl flex justify-between items-center">
              <span className="text-[#737686]">Transaction Hash:</span>
              <span className="font-mono text-[#004ac6] font-bold">{txHash}</span>
            </div>
          )}

          <div className="p-2.5 bg-[#6ffbbe]/20 rounded-xl text-[11px] text-[#002113] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006242] text-[18px]">gavel</span>
            <span>Cryptographically certified by Pollar Institutional multi-sig audit nodes.</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 bg-[#e5eeff] text-[#004ac6] font-bold rounded-xl text-[13px] hover:bg-[#dce9ff] transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>{copied ? 'Copied Hash!' : 'Copy Merkle Hash'}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#004ac6] text-white font-bold rounded-xl text-[13px] hover:bg-[#2563eb] transition-colors cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
