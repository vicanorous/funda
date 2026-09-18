import React, { useState } from 'react';
import { JointAccount } from '../../types';

interface CreateJointAccountModalProps {
  onClose: () => void;
  onCreate: (newAccount: Partial<JointAccount>) => void;
}

export const CreateJointAccountModal: React.FC<CreateJointAccountModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'ventures' | 'property' | 'community'>('ventures');
  const [coOwnerEmail, setCoOwnerEmail] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('1000.00');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsDeploying(true);

    setTimeout(() => {
      setIsDeploying(false);
      onCreate({
        name,
        category,
        balance: parseFloat(initialDeposit) || 1000,
        currency: 'USD',
        governanceRule: 'Multi-Sig 2/3',
        coOwnersCount: 2,
        contributorsCount: 1,
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 rounded-full bg-[#c3c6d7] mx-auto sm:hidden" />

        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#004ac6] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add_moderator</span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#0b1c30]">
              Create Joint Account
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#737686] hover:text-[#0b1c30] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-[13px]">
          <div>
            <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block mb-1">
              Account Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Series A Runway, Studio OpEx"
              className="w-full px-3 py-2.5 rounded-xl border border-[#c3c6d7] focus:border-[#004ac6] outline-none text-[#0b1c30]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block mb-1">
              Vault Classification
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ventures', label: 'Ventures' },
                { id: 'property', label: 'Property' },
                { id: 'community', label: 'Community' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id as any)}
                  className={`py-2 rounded-xl text-[12px] font-bold border transition-all cursor-pointer ${
                    category === c.id
                      ? 'bg-[#004ac6] text-white border-[#004ac6]'
                      : 'bg-[#eff4ff] text-[#434655] border-[#e5eeff]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block mb-1">
              Initial Co-Owner Email
            </label>
            <input
              type="email"
              value={coOwnerEmail}
              onChange={(e) => setCoOwnerEmail(e.target.value)}
              placeholder="partner@institution.com"
              className="w-full px-3 py-2.5 rounded-xl border border-[#c3c6d7] focus:border-[#004ac6] outline-none text-[#0b1c30]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block mb-1">
              Initial Treasury Capital (USD)
            </label>
            <input
              type="number"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#c3c6d7] focus:border-[#004ac6] outline-none font-mono font-bold text-[#0b1c30]"
            />
          </div>

          <div className="p-3 bg-[#eff4ff] rounded-xl text-[11px] text-[#434655] space-y-1">
            <span className="font-bold text-[#004ac6] block">Default Pollar Governance</span>
            <p>
              Requires <strong>ceil(coowners * 2 / 3) = 2 signatures</strong> for all withdrawal
              disbursements. Contributors can deposit and inspect the ledger anytime.
            </p>
          </div>

          <button
            type="submit"
            disabled={isDeploying || !name}
            className="w-full py-3 bg-[#004ac6] text-white font-bold rounded-xl text-[14px] hover:bg-[#2563eb] shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeploying ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deploying Smart Multi-Sig Vault...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Deploy Vault with Pollar</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
