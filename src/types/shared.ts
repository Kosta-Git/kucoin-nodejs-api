export interface Address {
  address: string;
  memo?: string;
  chain: string;
}

export interface KucoinResponse<T> {
  code: ResponseCode;
  data: T;
}

export interface AccountPageQuery {
  startAt?: number;
  endAt?: number;
  type?:
    | "RealisedPNL"
    | "Deposit"
    | "Withdrawal"
    | "TransferIn"
    | "TransferOut";
  offset?: number;
  forward?: boolean;
  maxCount?: number;
  currency?: string;
}

export type RefAccountType = "MAIN" | "TRADE";
export type Status = "PROCESSING" | "SUCCESS" | "FAILURE";

export interface TransferToKucoinAccount {
  amount: number;
  currency: string;
  refAccountType: RefAccountType;
}

export interface TransferResponse {
  applyId: string;
  bizNo: string;
  payAccountType: string;
  payTag: string;
  remark: string;
  recAccountType: RefAccountType;
  recTag: string;
  recRemark: string;
  recSystem: string;
  status: Status;
  currency: string;
  amount: string;
  fee: string;
  sn: number;
  reason: string;
  createdAt: number;
  updatedAt: number;
}

export interface TransferRecord {
  applyId:   string;
  currency:  string;
  recRemark: string;
  recSystem: string;
  status:    Status;
  amount:    string;
  reason:    string;
  offset:    number;
  createdAt: number;
  remark:    string;
}

export interface CurrencyPageQuery {
  startAt?: number;
  endAt?: number;
  pageSize?: number;
  currentPage?: number;
  status?: Status;
  currency?: string;
}

export interface Paged<T> {
  hasMore: boolean;
  dataList: T[];
}

export interface DetailedPage<T> {
  currentPage: number;
  pageSize: number;
  totalNum: number;
  totalPage: number;
  items: T[];
}

export interface Apply {
  applyId: string;
}

export enum ResponseCode {
  BLOCKED_30S = "1015", //cloudflare frequency limit according to IP, block 30s
  ACCOUNT_RESTRICTION = "40010", //Unavailable to place orders. Your identity information/IP/phone number shows you're at a country/region that is restricted from this service.
  INVALID_PARAMETERS = "100001", //There are invalid parameters
  SYSTEM_CONFIG_ERROR = "100002", //systemConfigError
  CONTRACT_PARAMS_INVALID = "100003", //Contract parameter invalid
  ORDER_NOT_CANCELLABLE = "100004", //Order is in not cancelable state
  CONRACT_RISK_LIMIT_NOT_EXIST = "100005", //contractRiskLimitNotExist
  OK = "200000", //Ok
  QUERY_SCOPE_L2 = "200001", //The query scope for Level 2 cannot exceed xxx
  TMR_BLOCKED_10S = "200002", //Too many requests in a short period of time, please retry later--kucoin business layer request frequency limit, block 10s
  QUERY_SCOPE_L3 = "200002", //The query scope for Level 3 cannot exceed xxx
  INVALID_SYMBOL = "200003", //The symbol parameter is invalid.
  ILLEGAL_PARAM = "300000", //request parameter illegal
  ACTIVE_ORDER_LIMIT = "300001", //Active order quantity limit exceeded (limit: xxx, current: xxx)
  ORDER_SUSPENDED = "300002", //Order placement/cancellation suspended, please try again later.
  BALANCE_TOO_LOW = "300003", //Balance not enough, please first deposit at least 2 USDT before you start the battle
  STOP_ORDER_LIMIT_EXCEEDED = "300004", //Stop order quantity limit exceeded (limit: xxx, current: xxx)
  RISK_LIMIT_EXCEEDED = "300005", //xxx risk limit exceeded
  CLOSE_PRICE_LOWER_THAN_BANKRUPTCY = "300006", //The close price shall be greater than the bankruptcy price. Current bankruptcy price: xxx.
  PRICE_WORSE_THAN_LIQUIDATION = "300007", //priceWorseThanLiquidationPrice
  UNAVAILABLE_PLACE_ORDER = "300008", //Unavailable to place the order, there's no contra order in the market.
  UNABLE_TO_CLOSE_POSITION = "300009", //Current position size: 0, unable to close the position.
  FAILED_CLOSING_POS = "300010", //Failed to close the position
  ORDER_PRICE_TOO_HIGH = "300011", //Order price cannot be higher than xxx
  ORDER_PRICE_TOO_LOW = "300012", //Order price cannot be lower than xxx
  UNABLE_PROCEED = "300013", //Unable to proceed the operation, there's no contra order in order book.
  POSITION_LIQUIDATED = "300014", //The position is being liquidated, unable to place/cancel the order. Please try again later.
  ORDER_NOT_AVAILABLE = "300015", //The order placing/cancellation is currently not available. The Contract/Funding is under the settlement process. When the process is completed, the function will be restored automatically. Please wait patiently and try again later.
  LEVERAGE_TOO_HIGH = "300016", //The leverage cannot be greater than xxx.
  UNAVAILABLE = "300017", //Unavailable to proceed the operation, this position is for Futures Brawl
  COID_REPEATED = "300018", //clientOid parameter repeated
  MISSING_SECURITY_HEADER = "400001", //Any of KC-API-KEY, KC-API-SIGN, KC-API-TIMESTAMP, KC-API-PASSPHRASE is missing in your request header.
  TIMESTAMP_ERROR = "400002", //KC-API-TIMESTAMP Invalid -- Time differs from server time by more than 5 seconds
  API_KEY_NOT_FOUND = "400003", //KC-API-KEY not exists
  API_PASSPHRASE_ERROR = "400004", //KC-API-PASSPHRASE error
  SIGNATURE_ERR = "400005", //Signature error -- Please check your signature
  IP_NOT_WHITELISTED = "400006", //The IP address is not in the API whitelist
  ACCESS_DENIED = "400007", //Access Denied -- Your API key does not have sufficient permissions to access the URI
  PARAM_ERR = "400100", //Parameter Error -- You tried to access the resource with invalid parameters
  URL_NOT_FOUND = "404000", //URL Not Found -- The requested resource could not be found
  USER_FROZEN = "411100", //User is frozen -- Please contact us via support center
  TMR = "429000", //Too Many Requests -- Trigger the total traffic limit of this interface of KuCoin server, you can retry the request
  INTERNAL_SERVER_ERROR = "500000", //Internal Server Error -- We had a problem with our server. Try again later.
}
