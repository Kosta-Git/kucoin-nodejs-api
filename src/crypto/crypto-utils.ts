import * as CryptoJs from "crypto-js";

export const hmac256 = (message: string, key: string): string => {
  return CryptoJs.enc.Base64.stringify(CryptoJs.HmacSHA256(message, key));
};

export const hmac256Request = (
  timestamp: number,
  method: string,
  endpoint: string,
  body: any,
  key: string
): string => {
  const hmac = CryptoJs.algo.HMAC.create(CryptoJs.algo.SHA256, key);
  hmac.update(CryptoJs.enc.Utf8.parse(timestamp.toString()));
  hmac.update(method);
  hmac.update(CryptoJs.enc.Utf8.parse("/" + endpoint));
  if (body) {
    hmac.update(body);
  }
  return CryptoJs.enc.Base64.stringify(hmac.finalize());
};
