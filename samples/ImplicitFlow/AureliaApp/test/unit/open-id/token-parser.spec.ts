import { TokenParser } from "../../../src/open-id/token-parser";
import { IdTokenModel } from "../../../src/open-id/id-token-model";
import { AccessTokenModel } from "../../../src/open-id/access-token-model";
import { OpenIdResponseModel } from "../../../src/open-id/open-id-response-model";
import { ProviderModel } from "../../../src/open-id/provider-model";
import { rawIdToken, rawAccessToken } from "./_test-data.js";

describe("the IdTokenParser", function () {

    let openIdResponse: OpenIdResponseModel = new OpenIdResponseModel();
    openIdResponse.IdToken = rawIdToken;
    openIdResponse.AccessToken = rawAccessToken;

    let parser: TokenParser = new TokenParser();

    it("decodes the id_token into an object", function () {
        let idToken: IdTokenModel = parser.DecodeIdToken(openIdResponse);
        expect(idToken.Email).toBe("bigfont@outlook.com");
        expect(idToken.AtHash).toBe("uEvxt_TU9bO48RTxr4REPA");
        expect(idToken.Aud).toBe("myClient");
        expect(idToken.Azp).toBe("myClient");
        expect(idToken.Exp).toBe(1470759385);
        expect(idToken.Iat).toBe(1470758185);
        expect(idToken.Iss).toBe("http://localhost:12345/");
        expect(idToken.Jti).toBe("5844ff4d-2876-4feb-8cd2-8d85038d370a");
        expect(idToken.Nbf).toBe(1470758185);
        expect(idToken.Nonce).toBe("this_is_not_a_real_nonce");
        expect(idToken.RawJwt).toBe(openIdResponse.IdToken);
        expect(idToken.Sub).toBe("77aa019f-a3f9-433c-80e0-75c8137e242d");
        expect(idToken.UniqueName).toBe("bigfont@outlook.com");
        expect(idToken.Usuage).toBe("id_token");
    });

    it("decodes the access_token into an object", function () {
        let accessToken: AccessTokenModel = parser.DecodeAccessToken(openIdResponse);
        expect(accessToken.Aud).toBe("https://contoso.com");
        expect(accessToken.Iss).toBe("https://sts.windows.net/e481747f-5da7-4538-cbbe-67e57f7d214e/");
        expect(accessToken.Nbf).toBe(1391210850);
        expect(accessToken.Exp).toBe(1391214450);
        expect(accessToken.Sub).toBe("21749daae2a91137c259191622fa1");
    });

    it("returns false when the id_token's iss claim does not match the provider's Issuer Identifier", function () {
        let idToken: IdTokenModel = new IdTokenModel();
        idToken.Iss = "fakseIss1";

        let provider: ProviderModel = new ProviderModel();
        provider.Issuer = "fakeIss2";

        let result: boolean = parser.ValidateIdToken(idToken, provider);
        expect(result).toBe(false);
    });

    it("returns true when the id_token's iss claim does not match the provider's Issuer Identifier", function () {
        let idToken: IdTokenModel = new IdTokenModel();
        idToken.Iss = "fakeIss";

        let provider: ProviderModel = new ProviderModel();
        provider.Issuer = "fakeIss";

        let result: boolean = parser.ValidateIdToken(idToken, provider);
        expect(result).toBe(true);
    });
});
