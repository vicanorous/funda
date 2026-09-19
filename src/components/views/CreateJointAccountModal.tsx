import React, { useState } from 'react';
import { PollarWalletService } from '../../lib/pollar/wallet';
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
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [coOwnerEmail, setCoOwnerEmail] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('5000.00');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsDeploying(true);

    try {
      const deployment = await PollarWalletService.createVault({
        name,
        creatorWallet: '0x8841...9PLR',
        coOwners: [coOwnerEmail || 'treasury.partner@funda.ng'],
        initialBalance: parseFloat(initialDeposit) || 5000,
        currency,
        quorumNumerator: 2,
        quorumDenominator: 3,
      });

      onCreate({
        name,
        category,
        balance: deployment.initialBalance,
        currency: deployment.currency,
        pollarWalletId: deployment.pollarWalletId,
        governanceRule: 'Multi-Sig 2/3',
        coOwnersCount: 2,
        contributorsCount: 1,
      });
      onClose();
    } catch (err) {
      console.error('Failed to deploy vault:', err);
    } finally {
      setIsDeploying(false);
    }
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
              Deploy Multi-Sig Joint Vault
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
              Vault Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lagos Supply Chain OpEx, Delta Treasury"
              className="w-full px-3 py-2.5 rounded-xl border border-[#c3c6d7] focus:border-[#004ac6] outline-none text-[#0b1c30]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block mb-1">
                Vault Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full p-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl text-[13px] font-bold text-[#0b1c30] outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="NGN">NGN (₦)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block mb-1">
                Initial Allocation
              </label>
              <input
                type="number"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                className="w-full p-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl text-[13px] font-bold text-[#0b1c30] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block mb-1">
              Vault Classification
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ventures', label: 'Ventures' },
                { id: 'property', label: 'Logistics' },
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
              Add Co-Owner Email (Quorum Signer)
            </label>
            <input
              type="email"
              value={coOwnerEmail}
              onChange={(e) => setCoOwnerEmail(e.target.value)}
              placeholder="e.g. treasury.lead@partner.ng"
              className="w-full px-3 py-2.5 rounded-xl border border-[#c3c6d7] focus:border-[#004ac6] outline-none text-[#0b1c30]"
            />
          </div>

          <div className="p-3 bg-[#eff4ff] rounded-xl text-[12px] space-y-1">
            <div className="flex justify-between text-[#434655]">
              <span>Governance Rule:</span>
              <span className="font-bold text-[#004ac6]">Multi-Sig 2/3 (PRD Formula)</span>
            </div>
            <div className="flex justify-between text-[#434655]">
              <span>Deployment Rail:</span>
              <span className="font-bold text-[#0b1c30]">Pollar Cryptographic Vault</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isDeploying || !name}
            className="w-full py-3 bg-[#004ac6] text-white rounded-xl font-bold text-[14px] shadow-md hover:bg-[#2563eb] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isDeploying ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deploying Vault Contract...</span>
              </>
            ) : (
              <span>Deploy Joint Vault</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
