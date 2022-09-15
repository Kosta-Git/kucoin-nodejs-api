import { KucoinBaseUrlKey } from './request-utils';
export interface RestClientOptions {
  api_key?: string;
  api_secret?: string;
  api_passphrase?: string;
  baseUrl?: string;
  debug?: boolean;

  // override the max size of the request window (in ms)
  recvWindow?: number;

  // how often to sync time drift with kucoin servers
  syncIntervalMs?: number | string;

  // Default: false. Disable above sync mechanism if true.
  disableTimeSync?: boolean;

  // Default: false. If true, we'll throw errors if any params are undefined
  strictParamValidation?: boolean;

  // Default: true. whether to try and post-process request exceptions.
  parseExceptions?: boolean;

  // manually override with one of the known base URLs in the library
  baseUrlKey?: KucoinBaseUrlKey,
}
