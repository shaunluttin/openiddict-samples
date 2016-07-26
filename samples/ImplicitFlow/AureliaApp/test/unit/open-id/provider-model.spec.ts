import { ProviderModel } from "../../../src/open-id/provider-model";

describe("the ProviderModel", function () {
    let providerModel = new ProviderModel();

    it("returns a correct configuration information uri", function () {

        let redirectUri = providerModel.ConfigurationInformationUri;
        expect(redirectUri).toBe(providerModel.Scheme
            + providerModel.OpenIdAuthority
            + providerModel.OpenIdConfigInfoPath);
    });
});
