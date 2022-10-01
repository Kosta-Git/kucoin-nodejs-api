import { RefAccountType } from "./shared";

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
  time: number;
  type: string;
  amount: number;
  fee: number;
  accountEquity: number;
  status: string;
  remark: string;
  offset: number;
  currency: string;
}

export interface FuturesApiForSubAccount {
  /**
   * IP whitelist(You may add up to 20 IPs. Use a halfwidth comma to each IP)
   */
  ipWhitelist: string;
  /**
   * Password(Must contain 7-32 characters. Cannot contain any spaces.)
   */
  passphrase: string;
  permission: "General" | "Trade";
  /**
   * Remarks(1~24 characters)
   */
  remark: string;
  subName: string;
}

export interface FuturesApiSubAccount {
  subName: string;
  remark: string;
  apiKey: string;
  apiSecret: string;
  passphrase: string;
  permission: string;
  ipWhitelist: string;
  createdAt: number;
}

export interface TransferToFutures {
  amount: number;
  currency: string;
  payAccountType: RefAccountType;
}

export interface TransferToFuturesResponse {
  code: string;
  msg: string;
  retry: boolean;
  success: boolean;
}

export interface Deposit {
  currency: string;
  status: "PROCESSING" | "WALLET_PROCESSING" | "SUCCESS" | "FAILURE";
  address: string;
  isInner: boolean;
  amount: number;
  fee: number;
  walletTxId: string;
  createdAt: number;
}

export interface WithdrawLimit {
  currency:            string;
  chainId:             string;
  limitAmount:         number;
  usedAmount:          number;
  remainAmount:        number;
  availableAmount:     number;
  withdrawMinFee:      number;
  innerWithdrawMinFee: number;
  withdrawMinSize:     number;
  isWithdrawEnabled:   boolean;
  precision:           number;
}

export interface Withdraw {
  currency:            string;
  chainId:             string;
  limitAmount:         number;
  usedAmount:          number;
  remainAmount:        number;
  availableAmount:     number;
  withdrawMinFee:      number;
  innerWithdrawMinFee: number;
  withdrawMinSize:     number;
  isWithdrawEnabled:   boolean;
  precision:           number;
}

export interface Order {
  // Unique order id created by users to identify their orders, e.g. UUID, Only allows numbers, characters, underline(_), and separator(-)
  clientOid: string;
  side: "buy" | "sell";
  symbol: string;
  type?: "limit" | "market";
  leverage: string;
  // remark for the order, length cannot exceed 100 utf8 characters
  remark?: string;
  // Either down or up. Requires stopPrice and stopPriceType to be defined
  stop?: "down" | "up";
  // Either TP, IP or MP, Need to be defined if stop is specified.
  stopPriceType?: "TP" | "IP" | "MP";
  // Need to be defined if stop is specified.
  stopPrice?: string;
  // A mark to reduce the position size only. Set to false by default. Need to set the position size when reduceOnly is true.
  reduceOnly?: boolean;
  // A mark to close the position. Set to false by default. It will close all the positions when closeOrder is true.
  closeOrder?: boolean;
  // A mark to forcely hold the funds for an order, even though it's an order to reduce the position size. This helps the order stay on the order book and not get canceled when the position size changes. Set to false by default.
  forceHold?: boolean;
}

export interface OrderResponse {
  orderid: string;
}
