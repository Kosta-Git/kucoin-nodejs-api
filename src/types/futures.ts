export interface Currency {
  currency: string;
}

export interface AccountOverview {
  accountEquity: number;
  unrealisedPNL: number;
  marginBalance: number;
  positionMargin: number;
  orderMargin: number;
  frozenFunds: number;
  availableBalance: number;
  currency: string;
}

export interface FuturesTransaction {
  time: number
  type: string
  amount: number
  fee: number
  accountEquity: number
  status: string
  remark: string
  offset: number
  currency: string
}