import {
  JointAccount,
  Membership,
  NotificationItem,
  PendingMember,
  PersonalWalletState,
  Transaction,
  User,
} from '../types';

export const CURRENT_USER: User | null = null;

export const INITIAL_JOINT_ACCOUNTS: JointAccount[] = [];

export const INITIAL_MEMBERSHIPS: Membership[] = [];

export const INITIAL_PENDING_MEMBERS: PendingMember[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_PERSONAL_WALLET: PersonalWalletState = {
  totalUsd: 0.0,
  displayCurrency: 'USD',
  yieldActive: false,
  yieldPercent: 0.0,
  holdings: {
    usd: 0.0,
    ngn: 0.0,
    eur: 0.0,
    gbp: 0.0,
  },
  guardrails: {
    autoTopupEnabled: false,
    autoTopupThreshold: 1000.0,
    autoTopupAmount: 500.0,
    lastTopupDate: 'None',
    targetUsdReserveFloor: 0.0,
  },
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
