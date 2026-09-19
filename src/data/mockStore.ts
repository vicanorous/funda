import {
  JointAccount,
  Membership,
  NotificationItem,
  PendingMember,
  PersonalWalletState,
  Transaction,
  User,
} from '../types';

export const CURRENT_USER: User = {
  id: 'usr_victor_nwoguji',
  name: 'Victor Nwoguji',
  email: 'vnwoguji@gmail.com',
  walletAddress: '0x8841...9PLR',
  kycStatus: 'TIER_2_VERIFIED',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
};

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
