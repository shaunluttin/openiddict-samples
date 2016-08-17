import { TokenParser } from "../../../src/open-id/token-parser";
import { IdTokenModel } from "../../../src/open-id/id-token-model";
import { OpenIdResponseModel } from "../../../src/open-id/open-id-response-model";
import { StorageService } from "../../../src/open-id/storage-service";
import { ProviderModel } from "../../../src/open-id/provider-model";
import { rawIdToken, rawAccessToken } from "./_test-data.js";

describe("the IdTokenParser", function () {

    let storageService: StorageService = new StorageService();

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

    it("throws when the id_token's iss claim does NOT match the provider's Issuer Identifier", function () {

        let provider: ProviderModel = new ProviderModel(storageService);
        spyOn(provider, "GetIssuer").and.returnValue("fakeIss2");

        function wrapper() {

            let idToken: IdTokenModel = new IdTokenModel();
            idToken.Iss = "fakseIss1";

            parser.ValidateIdToken(idToken, provider);
        }

        expect(wrapper).toThrow();
    });

    it("does not throw when the id_token's iss claim does match the provider's Issuer Identifier", function () {

        let provider: ProviderModel = new ProviderModel(storageService);
        spyOn(provider, "GetIssuer").and.returnValue("fakeIss");

        function wrapper() {

            let idToken: IdTokenModel = new IdTokenModel();
            idToken.Iss = "fakeIss";

            parser.ValidateIdToken(idToken, provider);
        }

        expect(wrapper).not.toThrow();
    });
});
