import { expect } from "chai";
import { FuturesClient } from "./../src/futures-client";
import * as dotenv from "dotenv";
import { ResponseCode } from "../src/types/shared";

dotenv.config();

describe("Futures REST API client", () => {
  const API_KEY = process.env.API_KEY;
  const API_SECRET = process.env.API_SECRET;
  const API_PASSPHRASE = process.env.API_PASSPHRASE;

  const api = new FuturesClient(
    {
      api_key: API_KEY,
      api_secret: API_SECRET,
      api_passphrase: API_PASSPHRASE,
      debug: false,
    },
    {},
    true
  );

  describe("User endpoints", () => {
    describe("Account endpoints", () => {
      it("gets account overview", async () => {
        const response = await api.user.getAccountOverview();
        expect(response.code).to.be.equal(ResponseCode.OK);
      });
      it("gets account overview with symbol", async () => {
        const response = await api.user.getAccountOverview({ currency: "USDT" });
        expect(response.code).to.be.equal(ResponseCode.OK);
      });
      it("gets transaction history", async () => {
        const response = await api.user.getTxHistory();
        expect(response.code).to.be.equal(ResponseCode.OK);
      });
    });
  });
});
