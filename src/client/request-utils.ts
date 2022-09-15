import { hmac256, hmac256Request } from "./../crypto/crypto-utils";
import { RestClientOptions } from "./rest-client-options";
import * as CryptoJs from "crypto-js";

export type KucoinBaseUrlKey = "futures" | "futures-test";

const KUCOIN_BASE_URLS: Record<KucoinBaseUrlKey, string> = {
  futures: "https://api-futures.kucoin.com",
  "futures-test": "https://api-sandbox-futures.kucoin.com",
};

export function getServerTimeEndpoint(urlKey: KucoinBaseUrlKey): string {
  switch (urlKey) {
    case "futures":
    case "futures-test":
    default:
      return "api/v1/timestamp";
  }
}

export function getRestBaseUrl(
  clientType: KucoinBaseUrlKey,
  restInverseOptions: RestClientOptions
): string {
  if (restInverseOptions.baseUrl) {
    return restInverseOptions.baseUrl;
  }

  if (restInverseOptions.baseUrlKey) {
    return KUCOIN_BASE_URLS[restInverseOptions.baseUrlKey];
  }

  return KUCOIN_BASE_URLS[clientType];
}

export type GenericAPIResponse<T = any> = Promise<T>;

export function serialiseParams(
  params: object = {},
  strict_validation = false,
  encodeValues: boolean = false
): string {
  return Object.keys(params)
    .map((key) => {
      const value = params[key];
      if (strict_validation === true && typeof value === "undefined") {
        throw new Error(
          "Failed to sign API request due to undefined parameter"
        );
      }
      const encodedValue = encodeValues ? encodeURIComponent(value) : value;
      return `${key}=${encodedValue}`;
    })
    .join("&");
}

export interface SignedRequestState {
  // Request body as an object, as originally provided by caller
  requestBody: any;
  // Params serialised into a query string, including timestamp and revvwindow
  serialisedParams: string | undefined;
  timestamp?: number;
  signature?: string;
  recvWindow?: number;
}

export function getRequestSignature(
  data: any,
  key?: string,
  secret?: string,
  recvWindow?: number,
  timestamp?: number,
  method?: string,
  endpoint?: string,
  strictParamValidation?: boolean
): SignedRequestState {
  // Optional, set to 5000 by default. Increase if timestamp/recvWindow errors are seen.
  const requestRecvWindow = data?.recvWindow ?? recvWindow ?? 5000;

  if (key && secret) {
    const requestParams = { ...data };
    const serialisedParams = serialiseParams(
      requestParams,
      strictParamValidation,
      true
    );

    // TODO: Clean this
    const path = (endpoint ?? "") +
    (serialisedParams.length > 0 && (method == "GET" ||method == "DELETE") ? "?" + serialisedParams : "")
    const body = (method == "GET" ||method == "DELETE") ? null : {...data};

    const signature = hmac256Request(
      timestamp || 0,
      method || "GET",
      path,
      body,
      secret
    );
    requestParams.signature = signature;

    return {
      requestBody: { ...data },
      serialisedParams,
      timestamp: timestamp,
      signature: signature,
      recvWindow: requestRecvWindow,
    };
  }

  return { requestBody: data, serialisedParams: undefined };
}
