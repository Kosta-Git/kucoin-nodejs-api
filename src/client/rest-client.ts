import { hmac256 } from './../crypto/crypto-utils';
import {
  GenericAPIResponse,
  getRequestSignature,
  getRestBaseUrl,
  KucoinBaseUrlKey,
  serialiseParams,
} from "./request-utils";
import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { RestClientOptions } from "./rest-client-options";

export default abstract class RestClient {
  private timeOffset: number = 0;
  private syncTimePromise: null | Promise<void>;
  private options: RestClientOptions;
  private baseUrl: string;
  private baseUrlKey: KucoinBaseUrlKey;
  private globalRequestOptions: AxiosRequestConfig;
  private key: string | undefined;
  private secret: string | undefined;
  private passphrase: string | undefined;

  public apiLimitLastUpdated: number;

  constructor(
    baseUrlKey: KucoinBaseUrlKey,
    options: RestClientOptions = {},
    requestOptions: AxiosRequestConfig = {}
  ) {
    this.options = {
      recvWindow: 5000,
      syncIntervalMs: 3600000,
      strictParamValidation: false,
      ...options,
    };

    this.globalRequestOptions = {
      timeout: 1000 * 60 * 5,
      headers: {},
      // custom request options based on axios specs - see: https://github.com/axios/axios#request-config
      ...requestOptions,
    };

    this.key = options.api_key;
    this.secret = options.api_secret;
    this.passphrase = options.api_passphrase;

    if (!this.key || !this.secret || !this.passphrase) {
      throw new Error("API key, secret and passphrase are required!");
    }

    if (this.globalRequestOptions && this.globalRequestOptions.headers) {
      const hmacPassphrase = hmac256(this.passphrase, this.secret);

      this.globalRequestOptions.headers["KC-API-KEY"] = this.key;
      this.globalRequestOptions.headers["KC-API-PASSPHRASE"] = hmacPassphrase;
      this.globalRequestOptions.headers["KC-API-KEY-VERSION"] = "2";
    }

    this.baseUrlKey = this.options.baseUrlKey || baseUrlKey;
    this.baseUrl = getRestBaseUrl(this.baseUrlKey, this.options);

    if (this.options.disableTimeSync !== true) {
      this.syncTime();
      setInterval(this.syncTime.bind(this), +this.options.syncIntervalMs!);
    }

    this.syncTimePromise = null;
  }

  abstract getServerTime(urlKeyOverride?: KucoinBaseUrlKey): Promise<number>;

  public getBaseUrlKey(): KucoinBaseUrlKey {
    return this.baseUrlKey;
  }

  public getRateLimitStates() {
    return {
      lastUpdated: this.apiLimitLastUpdated,
    };
  }

  /**
   * Return time sync offset, automatically set if time sync is enabled. A higher offset means system clock is behind server time.
   */
  public getTimeOffset(): number {
    return this.timeOffset;
  }

  protected setTimeOffset(value: number) {
    this.timeOffset = value;
  }

  protected get(endpoint: string, params?: any): GenericAPIResponse {
    return this._call("GET", endpoint, params);
  }

  protected getForBaseUrl(
    endpoint: string,
    baseUrlKey: KucoinBaseUrlKey,
    params?: any
  ) {
    const baseUrl = getRestBaseUrl(baseUrlKey, {});
    return this._call("GET", endpoint, params, baseUrl);
  }

  protected post(endpoint: string, params?: any): GenericAPIResponse {
    return this._call("POST", endpoint, params);
  }

  protected put(endpoint: string, params?: any): GenericAPIResponse {
    return this._call("PUT", endpoint, params);
  }

  protected delete(endpoint: string, params?: any): GenericAPIResponse {
    return this._call("DELETE", endpoint, params);
  }

  /**
   * @private Make a HTTP request to a specific endpoint. Private endpoints are automatically signed.
   */
  protected async _call(
    method: Method,
    endpoint: string,
    params?: any,
    baseUrlOverride?: string
  ): GenericAPIResponse {
    const timestamp = Date.now() + (this.getTimeOffset() || 0);

    if (!this.key || !this.secret || !this.passphrase) {
      throw new Error(
        "Private endpoints require key, secret and passphrase to be set."
      );
    }

    // Handles serialisation of params into query string (url?key1=value1&key2=value2), handles encoding of values, adds timestamp and signature to request.
    const { signature, requestBody } = getRequestSignature(
      params,
      this.key,
      this.secret,
      this.options.recvWindow,
      timestamp,
      method,
      endpoint,
      this.options.strictParamValidation
    );

    const baseUrl = baseUrlOverride || this.baseUrl;

    const options: AxiosRequestConfig<any> = {
      ...this.globalRequestOptions,
      url: [baseUrl, endpoint].join("/"),
      method: method,
      headers: {
        "KC-API-SIGN": signature || "",
        "KC-API-TIMESTAMP": timestamp,
        ...this.globalRequestOptions.headers,
      },
    };

    if (method === "GET" || method === "DELETE") {
      options.params = params;
    } else {
      options.data = serialiseParams(
        requestBody,
        this.options.strictParamValidation,
        true
      );
    }

    return axios(options)
      .then((response) => {
        if (response.status == 200) {
          return response.data;
        }
        throw response;
      })
      .then((response) => response)
      .catch((e) => this.parseException(e, options.url!));
  }

  /**
   * @private generic handler to parse request exceptions
   */
  private parseException(e: AxiosError, url: string): unknown {
    const { response, request, message } = e;

    if (this.options.parseExceptions === false) {
      throw e;
    }

    // Something happened in setting up the request that triggered an Error
    if (!response) {
      if (!request) {
        throw message;
      }

      // request made but no response received
      throw e;
    }

    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    throw {
      code: (response.data as any)?.code,
      message: (response.data as any)?.msg,
      body: response.data,
      headers: response.headers,
      requestUrl: url,
      requestBody: request.body,
      requestOptions: {
        ...this.options,
        api_key: undefined,
        api_secret: undefined,
      },
    };
  }

  /**
   * Trigger time sync and store promise
   */
  public syncTime(): Promise<void> {
    if (this.options.disableTimeSync === true) {
      return Promise.resolve();
    }

    if (this.syncTimePromise !== null) {
      return this.syncTimePromise;
    }

    this.syncTimePromise = this.fetchTimeOffset().then((offset) => {
      this.timeOffset = offset;
      this.syncTimePromise = null;
    });

    return this.syncTimePromise;
  }

  /**
   * Estimate drift based on client<->server latency
   */
  async fetchTimeOffset(): Promise<number> {
    try {
      const start = Date.now();
      const serverTime = await this.getServerTime();
      const end = Date.now();

      const avgDrift = (end - start) / 2;
      return Math.ceil(serverTime - end + avgDrift);
    } catch (e) {
      console.error("Failed to fetch get time offset: ", e);
      return 0;
    }
  }
}
