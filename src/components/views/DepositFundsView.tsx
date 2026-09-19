import React, { useState } from 'react';
import { PollarRampService } from '../../lib/pollar/ramp';
import { PersonalWalletState } from '../../types';

interface DepositFundsViewProps {
  walletState?: PersonalWalletState;
  onBack: () => void;
  onSuccess: (amount: number, currency: 'USD' | 'NGN') => void;
}

export const DepositFundsView: React.FC<DepositFundsViewProps> = ({
  walletState,
  onBack,
  onSuccess,
}) => {
  const [depositCurrency, setDepositCurrency] = useState<'USD' | 'NGN'>('NGN');
  const [amount, setAmount] = useState('50000.00');
  const [method, setMethod] = useState<'nip' | 'card' | 'swift'>('nip');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const virtualNuban = PollarRampService.getNgnVirtualAccount('Victor Nwoguji');
  const wireInfo = PollarRampService.getUsdWireInstructions('Victor Nwoguji');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProceed = () => {
    const num = parseFloat(amount) || (depositCurrency === 'NGN' ? 50000 : 500);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(num, depositCurrency);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Destination Account Card */}
      <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-[#e5eeff]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#e5eeff] text-[#004ac6] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
          </div>
          <div>
            <span className="text-[11px] text-[#737686] font-medium uppercase tracking-wider block">
              Crediting Treasury Account
            </span>
            <span className="font-bold text-[14px] text-[#0b1c30]">
              Personal Treasury ({depositCurrency})
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#737686] block">Current Balance</span>
          <span className="font-mono text-[13px] font-bold text-[#006242]">
            {depositCurrency === 'NGN'
              ? `₦${(walletState?.holdings.ngn ?? 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
              : `$${(walletState?.holdings.usd ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`}
          </span>
        </div>
      </div>

      {/* Deposit Currency & Amount Module */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#737686] uppercase tracking-wider">
            Deposit Amount
          </span>
          <div className="flex items-center bg-[#eff4ff] p-0.5 rounded-xl border border-[#dce9ff]">
            <button
              type="button"
              onClick={() => {
                setDepositCurrency('NGN');
                setAmount('50000.00');
                setMethod('nip');
              }}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                depositCurrency === 'NGN'
                  ? 'bg-[#004ac6] text-white shadow-2xs'
                  : 'text-[#434655] hover:text-[#0b1c30]'
              }`}
            >
              🇳🇬 NGN (₦)
            </button>
            <button
              type="button"
              onClick={() => {
                setDepositCurrency('USD');
                setAmount('1000.00');
              }}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                depositCurrency === 'USD'
                  ? 'bg-[#004ac6] text-white shadow-2xs'
                  : 'text-[#434655] hover:text-[#0b1c30]'
              }`}
            >
              🇺🇸 USD ($)
            </button>
          </div>
        </div>

        <div className="flex items-center border-b-2 border-[#004ac6] pb-2">
          <span className="text-[28px] font-bold text-[#434655] mr-1">
            {depositCurrency === 'NGN' ? '₦' : '$'}
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-[30px] font-['Plus_Jakarta_Sans'] font-extrabold text-[#0b1c30] outline-none bg-transparent"
            placeholder="0.00"
          />
          <span className="text-[14px] font-bold text-[#434655] uppercase">{depositCurrency}</span>
        </div>

        {/* Quick Amount Presets */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {(depositCurrency === 'NGN'
            ? ['25000', '50000', '100000', '500000']
            : ['500', '1000', '2500', '5000']
          ).map((val) => (
            <button
              key={val}
              onClick={() => setAmount(`${val}.00`)}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                amount === `${val}.00`
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#434655] hover:bg-[#e5eeff]'
              }`}
            >
              +{depositCurrency === 'NGN' ? `₦${parseInt(val).toLocaleString()}` : `$${parseInt(val).toLocaleString()}`}
            </button>
          ))}
        </div>
      </div>

      {/* Select On-Ramp Method */}
      <div className="space-y-2">
        <h2 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#0b1c30]">
          Select On-Ramp Method
        </h2>

        <div className="space-y-2">
          {/* Option 1: Instant NIBSS NIP Bank Transfer (Nigeria) */}
          <div
            onClick={() => setMethod('nip')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              method === 'nip'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff] hover:bg-[#eff4ff]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  method === 'nip' ? 'bg-[#004ac6] text-white' : 'bg-[#e5eeff] text-[#434655]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[14px] text-[#0b1c30]">
                    Instant NIBSS NIP Transfer
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#6ffbbe]/40 text-[#002113] text-[10px] font-bold">
                    Virtual NUBAN
                  </span>
                </div>
                <span className="text-[11px] text-[#434655]">
                  Providus / Wema • Pollar Fast Rails
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-bold text-[#006242]">FREE</span>
              <span className="text-[10px] text-[#737686] block">~2 mins</span>
            </div>
          </div>

          {/* Option 2: Instant Nigerian & International Debit Cards */}
          <div
            onClick={() => setMethod('card')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              method === 'card'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff] hover:bg-[#eff4ff]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  method === 'card' ? 'bg-[#004ac6] text-white' : 'bg-[#e5eeff] text-[#434655]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">credit_card</span>
              </div>
              <div>
                <span className="font-bold text-[14px] text-[#0b1c30] block">
                  Debit Cards (Pollar Pay)
                </span>
                <span className="text-[11px] text-[#434655]">Verve, Mastercard, Visa</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-bold text-[#434655]">0.8% Fee</span>
              <span className="text-[10px] text-[#737686] block">Instant</span>
            </div>
          </div>

          {/* Option 3: International / Domiciliary SWIFT Wire */}
          <div
            onClick={() => setMethod('swift')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              method === 'swift'
                ? 'bg-[#eff4ff] border-[#004ac6] ring-1 ring-[#004ac6]'
                : 'bg-white border-[#e5eeff] hover:bg-[#eff4ff]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  method === 'swift' ? 'bg-[#004ac6] text-white' : 'bg-[#e5eeff] text-[#434655]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">public</span>
              </div>
              <div>
                <span className="font-bold text-[14px] text-[#0b1c30] block">
                  USD Domiciliary &amp; Wire
                </span>
                <span className="text-[11px] text-[#434655]">Cross-border institutional wire</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-bold text-[#434655]">$15 Flat</span>
              <span className="text-[10px] text-[#737686] block">1-2 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nigerian NUBAN Virtual Account Details Card */}
      {method === 'nip' && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#eff4ff] pb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006242] text-[18px]">verified</span>
              <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#0b1c30]">
                Dedicated Nigerian Virtual NUBAN
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#004ac6] bg-[#dbe1ff] px-2 py-0.5 rounded-full">
              CBN / NIBSS Verified
            </span>
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between items-center py-1">
              <span className="text-[#737686]">Receiving Bank:</span>
              <span className="font-bold text-[#0b1c30]">{virtualNuban.bankName}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-[#eff4ff]">
              <span className="text-[#737686]">Account Name:</span>
              <span className="font-bold text-[#0b1c30]">{virtualNuban.accountName}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-[#eff4ff]">
              <span className="text-[#737686]">10-Digit NUBAN:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[16px] font-bold text-[#004ac6] tracking-wider">
                  {virtualNuban.accountNumber}
                </span>
                <button
                  onClick={() => handleCopy(virtualNuban.accountNumber, 'Account')}
                  className="px-2 py-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004ac6] font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  <span>{copiedField === 'Account' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Mandatory Reference Memo Box */}
            <div className="p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#004ac6] font-bold uppercase tracking-wider block">
                  Mandatory Reference Memo
                </span>
                <span className="font-mono text-[14px] font-extrabold text-[#0b1c30]">
                  {virtualNuban.referenceMemo}
                </span>
              </div>
              <button
                onClick={() => handleCopy(virtualNuban.referenceMemo, 'Memo')}
                className="px-2 py-1 bg-white text-[#004ac6] font-bold rounded-lg text-[11px] shadow-2xs hover:bg-[#dce9ff] cursor-pointer"
              >
                {copiedField === 'Memo' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SWIFT Details Card */}
      {method === 'swift' && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#eff4ff] pb-2">
            <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#0b1c30]">
              Global SWIFT Routing Details
            </span>
            <span className="text-[10px] font-bold text-[#004ac6] bg-[#dbe1ff] px-2 py-0.5 rounded-full">
              Pollar Global Custody
            </span>
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between items-center py-1">
              <span className="text-[#737686]">Beneficiary Name:</span>
              <span className="font-bold text-[#0b1c30]">{wireInfo.beneficiaryName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-[#eff4ff]">
              <span className="text-[#737686]">SWIFT / BIC:</span>
              <span className="font-mono font-bold text-[#0b1c30]">{wireInfo.swiftBic}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-[#eff4ff]">
              <span className="text-[#737686]">Routing Number:</span>
              <span className="font-mono font-bold text-[#0b1c30]">{wireInfo.routingCode}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-[#eff4ff]">
              <span className="text-[#737686]">Virtual Account:</span>
              <span className="font-mono font-bold text-[#0b1c30]">{wireInfo.accountNumber}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleProceed}
        disabled={isProcessing || !amount || parseFloat(amount) <= 0}
        className="w-full py-3.5 px-4 bg-[#004ac6] text-white rounded-xl font-bold text-[15px] shadow-md hover:bg-[#2563eb] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing Deposit on Pollar Rails...</span>
          </>
        ) : (
          <>
            <span>
              Deposit {depositCurrency === 'NGN' ? `₦${parseFloat(amount || '0').toLocaleString()}` : `$${parseFloat(amount || '0').toLocaleString()} USD`}
            </span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </>
        )}
      </button>
    </div>
  );
};
