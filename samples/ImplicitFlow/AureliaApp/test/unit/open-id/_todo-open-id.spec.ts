import { HttpClient } from "aurelia-fetch-client";
import { OpenId } from "../../../src/open-id/open-id";
import { RouterConfigurationService } from "../../../src/open-id/router-configuration-service";
import { HttpDiscoveryService } from "../../../src/open-id/http-discovery-service";
import { ImplicitFlowService } from "../../../src/open-id/implicit-flow-service";
import { StorageService } from "../../../src/open-id/storage-service";
import { OpenIdResponseParser } from "../../../src/open-id/open-id-response-parser";
import { WindowService } from "../../../src/open-id/window-service";
import { ProviderModel } from "../../../src/open-id/provider-model";
import { UserInfoModel } from "../../../src/open-id/user-info-model";
import { ClientModel } from "../../../src/open-id/client-model";
import { TokenParser } from "../../../src/open-id/token-parser";
import { MockPromises } from "./_mock-promises.js";

describe("the OpenId class", function () {

    let mockWindow = <Window>{
        location: <Location>{},
    };

    let storageService = new StorageService();
    let tokenParser = new TokenParser();
    let openIdResponseParser = new OpenIdResponseParser();
    let providerModel = new ProviderModel();
    let clientModel = new ClientModel();
    let httpClient = new HttpClient();
    let httpDiscoveryService = new HttpDiscoveryService(httpClient, providerModel, clientModel);
    let windowService = new WindowService(mockWindow);
    let implicitFlowService = new ImplicitFlowService(
        httpDiscoveryService, openIdResponseParser, tokenParser, storageService, providerModel, windowService);
    let routerConfigurationService = new RouterConfigurationService(clientModel);

    let openId = new OpenId(
        httpDiscoveryService,
        implicitFlowService,
        routerConfigurationService,
        storageService,
        windowService);

    describe("the Configure method", function () {

        beforeEach(function () {
            spyOn(routerConfigurationService, "ConfigureRouter");
        });

        it("configures the Aurelia router via the RouterConfigurationService", function () {
            openId.Configure(null, null);
            expect(routerConfigurationService.ConfigureRouter).toHaveBeenCalled();
        });
    });

    describe("the Login method", function () {

        beforeEach(function (done) {
            spyOn(implicitFlowService, "PrepareAuthenticationRequest").and.callFake(function () {
                return MockPromises.PrepareAuthenticationRequest;
            });

            spyOn(implicitFlowService, "SendRequestToAuthorizationServer").and.callFake(function () {
                done();
            });

            openId.Login();
        });

        it("prepares an OpenID authentication request", function () {
            expect(implicitFlowService.PrepareAuthenticationRequest).toHaveBeenCalled();
        });

        it("sends the prepared OpenId authentication request", function () {
            expect(implicitFlowService.SendRequestToAuthorizationServer)
                .toHaveBeenCalledWith("dummy_authentication_request");
        });
    });

    describe("the Logout method", function () {

        beforeEach(function (done) {

            spyOn(httpDiscoveryService, "CreateLogoutUri").and.callFake(() => {
                return MockPromises.CreateLogoutUri;
            });

            spyOn(windowService, "SetHref").and.callFake(() => {
                done();
            });

            openId.Logout();
        });

        it("creates the logout URI", function () {
            expect(httpDiscoveryService.CreateLogoutUri).toHaveBeenCalled();
        });

        it("redirects to the logout URI", function () {
            expect(windowService.SetHref).toHaveBeenCalledWith("dummy_logout_uri");
        });
    });



    describe("the LoginRedirectHandler", function () {

        beforeEach(function () {
            spyOn(storageService, "SetAccessToken").and.callFake(() => { });
            spyOn(storageService, "SetIdToken").and.callFake(() => { });
            spyOn(implicitFlowService, "ValidateIdTokenAndRetrieveSubjectIdentifier").and.callFake(() => {
                return new UserInfoModel();
            });
            openId.LoginRedirectHandler();
        });

        it("validates the id token and retrieves the subject identifier", function () {
            expect(implicitFlowService.ValidateIdTokenAndRetrieveSubjectIdentifier).toHaveBeenCalled();
        });

        it("stores the id token", function () {
            expect(storageService.SetIdToken).toHaveBeenCalled();
        });

        it("stores the access token", function () {
            expect(storageService.SetAccessToken).toHaveBeenCalled();
        });
    });

    describe("the PostLogoutRedirectHandler", function () {

        beforeEach(function () {
            spyOn(storageService, "ClearStorageServiceItems").and.callFake(() => { });
            openId.PostLogoutRedirectHandler();
        });

        it("clears all storage items that this plugin manages", function () {
            expect(storageService.ClearStorageServiceItems).toHaveBeenCalled();
        });

    });

    describe("the isLoggedIn method", function () {

        it("returns true if this plugin's access token is present", function () {
            spyOn(storageService, "GetAccessToken").and.returnValue("fake_access_token_value");
            expect(openId.IsLoggedIn()).toBe(true);
        });

        it("returns false if this plugin's access token is absent", function () {
            spyOn(storageService, "GetAccessToken").and.returnValue(null);
            expect(openId.IsLoggedIn()).toBe(false);
        });
    });
});
