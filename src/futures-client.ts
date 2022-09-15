import { AccountOverview, Currency, FuturesTransaction } from './types/futures';
import { AxiosRequestConfig } from "axios";
import { getServerTimeEndpoint, KucoinBaseUrlKey } from "./client/request-utils";
import RestClient from "./client/rest-client";
import { RestClientOptions } from "./client/rest-client-options";
import { KucoinResponse, Paged, PageQuery } from './types/shared';

export class FuturesClient extends RestClient {
  private clientId: KucoinBaseUrlKey;

  constructor(
    restClientOptions: RestClientOptions = {},
    requestOptions: AxiosRequestConfig = {},
    useTestnet: boolean = false
  ) {
    const clientId = useTestnet ? 'futures-test' : 'futures';
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

  /**
   * ==============
   * User endpoints
   * ==============
   */

  public getAccountOverview(params?: Currency): Promise<KucoinResponse<AccountOverview>> {
    return this.get('api/v1/account-overview', params);
  }

  public getTxHistory(params?: PageQuery): Promise<KucoinResponse<Paged<FuturesTransaction>>> {
    return this.get('api/v1/transaction-history', params);
  }
}
