/**
 * Pollar Fiat On-Ramp & Cash Out Off-Ramp Service
 */

export interface VirtualWireAccount {
  beneficiaryName: string;
  routingCode: string;
  virtualAccountNumber: string;
  mandatoryReferenceMemo: string;
}

export class PollarRampService {
  public static getDepositInstructions(userWalletId: string): VirtualWireAccount {
    return {
      beneficiaryName: 'Funda Custody LLC',
      routingCode: '021000021',
      virtualAccountNumber: '8839-2091-8841',
      mandatoryReferenceMemo: 'FD-V9941',
    };
  }

  public static async calculateFee(
    method: 'POLLAR_WIRE' | 'CARD' | 'SWIFT',
    amount: number,
  ): Promise<{ fee: number; estimatedArrival: string; description: string }> {
    if (method === 'POLLAR_WIRE') {
      return {
        fee: 0,
        estimatedArrival: '~10 mins',
        description: 'Instant • Free',
      };
    } else if (method === 'CARD') {
      return {
        fee: Number((amount * 0.008).toFixed(2)),
        estimatedArrival: 'Instantaneous',
        description: '0.8% Processing Fee',
      };
    } else {
      return {
        fee: 15.0,
        estimatedArrival: '1-2 Business Days',
        description: '$15.00 flat fee',
      };
    }
  }

  public static async initiateCashOut(params: {
    amount: number;
    destinationBank: string;
    speed: 'STANDARD' | 'INSTANT';
  }): Promise<{ status: 'DISPATCHED'; fee: number; arrival: string; txRef: string }> {
    const fee = params.speed === 'INSTANT' ? 1.5 : 0.0;
    const arrival = params.speed === 'INSTANT' ? 'Today in ~15 mins' : 'Today by 16:30 PM';
    return {
      status: 'DISPATCHED',
      fee,
      arrival,
      txRef: `FND-${Math.floor(10000 + Math.random() * 90000)}`,
    };
  }
}
