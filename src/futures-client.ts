import {
  AccountOverview,
  Currency,
  FuturesTransaction,
  FuturesApiForSubAccount,
  FuturesApiSubAccount,
  Deposit,
  Withdraw,
  WithdrawLimit,
  TransferToFutures,
  TransferToFuturesResponse,
  Order,
  OrderResponse,
} from "./types/futures";
import { AxiosRequestConfig } from "axios";
import {
  getServerTimeEndpoint,
  KucoinBaseUrlKey,
} from "./client/request-utils";
import RestClient from "./client/rest-client";
import { RestClientOptions } from "./client/rest-client-options";
import {
  Address,
  KucoinResponse,
  Paged,
  AccountPageQuery,
  CurrencyPageQuery,
  DetailedPage,
  Apply,
  TransferToKucoinAccount,
  TransferResponse,
  TransferRecord,
} from "./types/shared";

export class FuturesClient extends RestClient {
  private clientId: KucoinBaseUrlKey;

  constructor(
    restClientOptions: RestClientOptions = {},
    requestOptions: AxiosRequestConfig = {},
    useTestnet: boolean = false
  ) {
    const clientId = useTestnet ? "futures-test" : "futures";
    super(clientId, restClientOptions, requestOptions);
    this.clientId = clientId;
    return this;
  }

  /**
   * Abstraction required by each client to aid with time sync / drift handling
   */
  async getServerTime(
    urlKeyOverride?: KucoinBaseUrlKey | undefined
  ): Promise<number> {
    return this.get(getServerTimeEndpoint(this.clientId)).then(
      (response) => response.serverTime
    );
  }

  //#region User API
  public user = {
    getAccountOverview: this.getAccountOverview,
    getTxHistory: this.getTxHistory,
    createFuturesApiForSubAccount: this.createFuturesApiForSubAccount,
    getDepositAddress: this.getDepositAddress,
    getDepositsList: this.getDepositsList,
    getWithdrawalLimit: this.getWithdrawalLimit,
    getWithdrawalList: this.getWithdrawalList,
    cancelWithdrawal: this.cancelWithdrawal,
    transferFundsToKucoinAccountV3: this.transferFundsToKucoinAccountV3,
    transferFundsToKucoinFuturesAccount:
      this.transferFundsToKucoinFuturesAccount,
    getTransferOutRecords: this.getTransferOutRecords,
    cancelTransferOut: this.cancelTransferOut,
  };

  /**
   * ==============
   * Account endpoints
   * ==============
   */

  private getAccountOverview(
    params?: Currency
  ): Promise<KucoinResponse<AccountOverview>> {
    return this.get("api/v1/account-overview", params);
  }

  private getTxHistory(
    params?: AccountPageQuery
  ): Promise<KucoinResponse<Paged<FuturesTransaction>>> {
    return this.get("api/v1/transaction-history", params);
  }

  private createFuturesApiForSubAccount(
    params?: FuturesApiForSubAccount
  ): Promise<KucoinResponse<FuturesApiSubAccount>> {
    return this.post("api/v1/sub/api-key", params);
  }

  /**
   * ==============
   * Deposit endpoints
   * ==============
   */

  private getDepositAddress(
    params?: Currency
  ): Promise<KucoinResponse<Address>> {
    return this.get("api/v1/deposit-address", params);
  }

  private getDepositsList(
    params?: CurrencyPageQuery
  ): Promise<KucoinResponse<DetailedPage<Deposit>>> {
    return this.get("api/v1/deposit-list", params);
  }

  /**
   * ==============
   * Withdrawal endpoints
   * ==============
   */

  private getWithdrawalLimit(
    params?: Currency
  ): Promise<KucoinResponse<WithdrawLimit>> {
    return this.get("api/v1/withdrawals/quotas", params);
  }

  private getWithdrawalList(
    params?: CurrencyPageQuery
  ): Promise<KucoinResponse<DetailedPage<Withdraw>>> {
    return this.get("api/v1/withdrawals-list", params);
  }

  private cancelWithdrawal(id: string): Promise<KucoinResponse<Apply>> {
    return this.delete(`api/v1/withdrawals/${id}`);
  }

  /**
   * ==============
   * Transfer endpoints
   * ==============
   */

  private transferFundsToKucoinAccountV3(
    params?: TransferToKucoinAccount
  ): Promise<TransferResponse> {
    return this.post("api/v3/transfer-out", params);
  }

  private transferFundsToKucoinFuturesAccount(
    params?: TransferToFutures
  ): Promise<TransferToFuturesResponse> {
    return this.post("api/v1/transfer-in", params);
  }

  private getTransferOutRecords(
    params?: CurrencyPageQuery
  ): Promise<DetailedPage<TransferRecord>> {
    return this.get("api/v1/transfer-list", params);
  }

  private cancelTransferOut(id: string): Promise<KucoinResponse<null>> {
    return this.delete(`api/v1/cancel/transfer-out/${id}`);
  }
  //#endregion

  //#region Trade API
  public trade = {
    placeOrder: this.placeOrder
  };

  /**
   * ==============
   * Orders endpoints
   * ==============
   */

  private placeOrder(
    params?: Order
  ): Promise<KucoinResponse<OrderResponse>> {
    return this.post("api/v1/orders", params);
  }

  //#endregion

  //#region Market Data
  public market = {};
  //#endregion

  //#region Websocket
  public ws = {};
  //#endregion
}
