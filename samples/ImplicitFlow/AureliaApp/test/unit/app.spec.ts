import { App } from "../../src/app";
import { OpenId } from "../../src/open-id/open-id";

describe("the App", () => {
  it("sets the openId property", () => {
    let openId = new OpenId(null, null, null, null, null);
    expect(new App(openId).openId).toBe(openId);
  });
});
