import { HttpDiscoveryService } from "../../../src/open-id/http-discovery-service";
import { StorageService } from "../../../src/open-id/storage-service";
import { HttpClient } from "aurelia-fetch-client";
import { ProviderModel } from "../../../src/open-id/provider-model";
import { ClientModel } from "../../../src/open-id/client-model";
import { MockPromises } from "./_mock-promises.js";

describe("the HttpDiscoveryService", function () {

    let httpClient: HttpClient = new HttpClient();
    let storageService: StorageService = new StorageService();

    let httpDiscoveryService: HttpDiscoveryService
        = new HttpDiscoveryService(httpClient, new ProviderModel(storageService), new ClientModel());

    beforeEach(function () {
        spyOn(httpClient, "fetch").and.callFake(function () {
            return MockPromises.ConfigurationInformationUriResponse;
        });
    });

    it("builds the correct configuration information uri", function () {
        let result = httpDiscoveryService.ConfigurationInformationUri;
        expect(result).toBe(httpDiscoveryService.Provider.Scheme
            + httpDiscoveryService.Provider.OpenIdAuthority
            + httpDiscoveryService.Provider.OpenIdConfigInfoPath);
    });

    it("returns a promise after obtaining configuration info", function (done) {
        let result = httpDiscoveryService.ObtainOpenIdProviderConfigurationInformation();
        result.then(function (val) {
            expect(val).toBe("The provider is ready for use.");
            done();
        });
    });

    it("sets the authorization endpoint after obtaining configuration info", function (done) {
        let result = httpDiscoveryService.ObtainOpenIdProviderConfigurationInformation();
        result.then(function (val) {
            expect(httpDiscoveryService.Provider.GetAuthorizationEndpoint()).toBe("dummy_authorization_endpoint");
            done();
        });
    });

    it("sets the end session endpoint after obtaining configuration info", function (done) {
        let result = httpDiscoveryService.ObtainOpenIdProviderConfigurationInformation();
        result.then(function (val) {
            expect(httpDiscoveryService.Provider.EndSessionEndpoint).toBe("dummy_end_session_endpoint");
            done();
        });
    });

    it("creates the authentication request uri", function (done) {
        let result = httpDiscoveryService.CreateAuthenticationRequestUri();
        result.then(function (val) {
            expect(httpDiscoveryService.Provider.GetAuthorizationEndpoint()).toBe("dummy_authorization_endpoint");
            expect(val).toContain("?client_id");

            // TODO add further tests re: the structure of the URI

            expect(val).toContain(httpDiscoveryService.Provider.GetAuthorizationEndpoint());
            done();
        });
    });

    it("creates the logout uri", function (done) {
        let result = httpDiscoveryService.CreateLogoutUri();
        result.then(function (val) {
            expect(httpDiscoveryService.Provider.EndSessionEndpoint).toBe("dummy_end_session_endpoint");
            expect(val).toContain("?post_logout_redirect_uri");
            expect(val).toContain(httpDiscoveryService.Provider.EndSessionEndpoint);
            done();
        });
    });
});
