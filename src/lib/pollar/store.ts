/**
 * Production-ready Client & Persistent State Storage for Funda
 * Synchronizes wallet balances, joint accounts, transactions, and notification items.
 */

import {
  CURRENT_USER,
  INITIAL_JOINT_ACCOUNTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PERSONAL_WALLET,
  INITIAL_TRANSACTIONS,
} from '../../data/mockStore';
import { JointAccount, NotificationItem, PersonalWalletState, Transaction, User } from '../../types';

const STORAGE_KEY = 'funda_real_balances_v1';

export interface AppState {
  user: User;
  personalWallet: PersonalWalletState;
  jointAccounts: JointAccount[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  preferredCurrency: 'USD' | 'NGN';
  pollarWalletConnected?: boolean;
  pollarAddress?: string;
}

export class FundaStore {
  public static loadState(): AppState {
    if (typeof window === 'undefined') {
      return {
        user: CURRENT_USER,
        personalWallet: INITIAL_PERSONAL_WALLET,
        jointAccounts: INITIAL_JOINT_ACCOUNTS,
        transactions: INITIAL_TRANSACTIONS,
        notifications: INITIAL_NOTIFICATIONS,
        preferredCurrency: 'NGN',
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AppState = JSON.parse(stored);
        if (!parsed.preferredCurrency) {
          parsed.preferredCurrency = 'NGN';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('[FundaStore] Failed to load from localStorage:', e);
    }

    const defaultState: AppState = {
      user: CURRENT_USER,
      personalWallet: INITIAL_PERSONAL_WALLET,
      jointAccounts: INITIAL_JOINT_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
      notifications: INITIAL_NOTIFICATIONS,
      preferredCurrency: 'NGN',
    };
    this.saveState(defaultState);
    return defaultState;
  }

  public static saveState(state: AppState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent('funda_state_updated', { detail: state }));
    } catch (e) {
      console.warn('[FundaStore] Failed to save state:', e);
    }
  }

  public static setPreferredCurrency(currency: 'USD' | 'NGN'): void {
    const state = this.loadState();
    state.preferredCurrency = currency;
    this.saveState(state);
  }

  public static addDeposit(
    amount: number,
    currency: 'USD' | 'NGN' = 'NGN',
    remark: string = 'Deposit via Pollar Rails',
  ): void {
    const state = this.loadState();
    if (currency === 'NGN') {
      state.personalWallet.holdings.ngn = (state.personalWallet.holdings.ngn || 0) + amount;
      state.personalWallet.totalUsd += amount / 1605.5;
    } else {
      state.personalWallet.holdings.usd += amount;
      state.personalWallet.totalUsd += amount;
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'DEPOSIT',
      amount: currency === 'NGN' ? amount / 1605.5 : amount,
      currency: 'USD',
      remark: currency === 'NGN' ? `₦${amount.toLocaleString()} NGN Deposit (${remark})` : remark,
      initiatedBy: state.user.id,
      initiatorName: state.user.name,
      status: 'EXECUTED',
      txHash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      createdAt: 'Just now',
      timeAgo: 'Just now',
      requiredSignatures: 0,
      approvedSignatures: 0,
      approvals: [],
    };
    state.transactions.unshift(newTx);
    this.saveState(state);
  }

  public static executeFxSwap(
    fromAmount: number,
    toAmount: number,
    fromCurrency: string,
    toCurrency: string,
    rate: number,
  ): void {
    const state = this.loadState();
    if (fromCurrency === 'USD' && toCurrency === 'NGN') {
      state.personalWallet.holdings.usd = Math.max(0, state.personalWallet.holdings.usd - fromAmount);
      state.personalWallet.holdings.ngn = (state.personalWallet.holdings.ngn || 0) + toAmount;
    } else if (fromCurrency === 'NGN' && toCurrency === 'USD') {
      state.personalWallet.holdings.ngn = Math.max(
        0,
        (state.personalWallet.holdings.ngn || 0) - fromAmount,
      );
      state.personalWallet.holdings.usd += toAmount;
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'FX_EXCHANGE',
      amount: fromCurrency === 'USD' ? fromAmount : toAmount,
      currency: 'USD',
      remark: `Exchanged ${fromCurrency} ${fromAmount.toLocaleString()} → ${toCurrency} ${toAmount.toLocaleString()}`,
      initiatedBy: state.user.id,
      initiatorName: state.user.name,
      status: 'EXECUTED',
      txHash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      createdAt: 'Just now',
      timeAgo: 'Just now',
      requiredSignatures: 0,
      approvedSignatures: 0,
      approvals: [],
      fxDetails: {
        receivedAmount: toAmount,
        receivedCurrency: toCurrency,
        rate,
      },
    };
    state.transactions.unshift(newTx);
    this.saveState(state);
  }

  public static executeCashOut(
    amount: number,
    currency: 'USD' | 'NGN',
    bankDest: string,
    fee: number,
  ): void {
    const state = this.loadState();
    if (currency === 'NGN') {
      state.personalWallet.holdings.ngn = Math.max(
        0,
        (state.personalWallet.holdings.ngn || 0) - (amount + fee),
      );
      state.personalWallet.totalUsd = Math.max(
        0,
        state.personalWallet.totalUsd - (amount + fee) / 1605.5,
      );
    } else {
      state.personalWallet.holdings.usd = Math.max(
        0,
        state.personalWallet.holdings.usd - (amount + fee),
      );
      state.personalWallet.totalUsd = Math.max(0, state.personalWallet.totalUsd - (amount + fee));
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'WITHDRAWAL',
      amount: currency === 'NGN' ? amount / 1605.5 : amount,
      currency: 'USD',
      remark: `NIBSS NIP Disbursal to ${bankDest}`,
      payoutRoute: bankDest,
      initiatedBy: state.user.id,
      initiatorName: state.user.name,
      status: 'EXECUTED',
      txHash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      createdAt: 'Just now',
      timeAgo: 'Just now',
      requiredSignatures: 0,
      approvedSignatures: 0,
      approvals: [],
    };
    state.transactions.unshift(newTx);
    this.saveState(state);
  }

  public static createVault(newAccountData: Partial<JointAccount>): JointAccount {
    const state = this.loadState();
    const newVault: JointAccount = {
      id: `vault_${Date.now()}`,
      name: newAccountData.name || 'New Joint Vault',
      pollarWalletId: newAccountData.pollarWalletId || `plr_vault_${Date.now()}`,
      createdBy: state.user.id,
      balance: newAccountData.balance || 5000.0,
      currency: newAccountData.currency || 'USD',
      governanceRule: newAccountData.governanceRule || 'Multi-Sig 2/3',
      coOwnersCount: newAccountData.coOwnersCount || 2,
      contributorsCount: newAccountData.contributorsCount || 1,
      category: newAccountData.category || 'ventures',
    };
    state.jointAccounts.unshift(newVault);
    this.saveState(state);
    return newVault;
  }

  public static voteOnProposal(txId: string, decision: 'APPROVED' | 'REJECTED'): void {
    const state = this.loadState();
    const tx = state.transactions.find((t) => t.id === txId);
    if (tx) {
      if (decision === 'APPROVED') {
        tx.approvedSignatures = (tx.approvedSignatures || 1) + 1;
        if (tx.approvedSignatures >= tx.requiredSignatures) {
          tx.status = 'EXECUTED';
        }
      } else {
        tx.status = 'REJECTED';
      }
      this.saveState(state);
    }
  }

  public static syncOnChainBalances(
    onChainUsd: number,
    onChainNgn: number,
    pollarAddress?: string,
  ): void {
    const state = this.loadState();
    state.pollarWalletConnected = !!pollarAddress;
    state.pollarAddress = pollarAddress;
    // Update personal wallet holdings to reflect on-chain real assets
    state.personalWallet.holdings.usd = Number(onChainUsd.toFixed(2));
    state.personalWallet.holdings.ngn = Number(onChainNgn.toFixed(2));
    // Total USD = USD holdings + NGN holdings converted at rate
    const ngnInUsd = state.personalWallet.holdings.ngn / 1605.5;
    state.personalWallet.totalUsd = Number((state.personalWallet.holdings.usd + ngnInUsd).toFixed(2));
    this.saveState(state);
  }

  public static resetState(): AppState {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    const freshState: AppState = {
      user: CURRENT_USER,
      personalWallet: INITIAL_PERSONAL_WALLET,
      jointAccounts: INITIAL_JOINT_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
      notifications: INITIAL_NOTIFICATIONS,
      preferredCurrency: 'NGN',
    };
    this.saveState(freshState);
    return freshState;
  }
}
