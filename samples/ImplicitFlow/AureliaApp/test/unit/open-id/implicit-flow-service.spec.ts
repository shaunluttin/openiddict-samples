import { HttpClient } from "aurelia-fetch-client";
import { ImplicitFlowService } from "../../../src/open-id/implicit-flow-service";
import { UriHelper } from "../../../src/open-id/uri-helper";
import { WindowService } from "../../../src/open-id/window-service";
import { ClientModel } from "../../../src/open-id/client-model";
import { ProviderModel } from "../../../src/open-id/provider-model";
import { TokenParser } from "../../../src/open-id/token-parser";
import { StorageService } from "../../../src/open-id/storage-service";
import { OpenIdResponseModel } from "../../../src/open-id/open-id-response-model";
import { OpenIdResponseParser } from "../../../src/open-id/open-id-response-parser";
import { IdTokenModel } from "../../../src/open-id/id-token-model";
import { UserInfoModel } from "../../../src/open-id/user-info-model";
import { HttpDiscoveryService } from "../../../src/open-id/http-discovery-service";
import { MockPromises } from "./_mock-promises.js";

describe("the ImplicitFlowService", function () {

    let httpClient: HttpClient = new HttpClient();
    let windowService: WindowService = new WindowService();
    let tokenParser: TokenParser = new TokenParser();
    let storageService: StorageService = new StorageService();
    let providerModel: ProviderModel = new ProviderModel(storageService);
    let clientModel: ClientModel = new ClientModel();
    let openIdResponseParser: OpenIdResponseParser = new OpenIdResponseParser();
    let httpDiscoveryService: HttpDiscoveryService = new HttpDiscoveryService(httpClient, providerModel, clientModel);

    let implicitFlowService: ImplicitFlowService = new ImplicitFlowService(
        httpDiscoveryService,
        openIdResponseParser,
        tokenParser,
        storageService,
        providerModel,
        windowService);

    beforeEach(function () {
        spyOn(httpClient, "fetch").and.callFake(function () {
            return MockPromises.ConfigurationInformationUriResponse;
        });
    });

    describe("the call to PrepareAuthenticationRequest", function () {

        it("prepares an authentication request that contains the REQUIRED response_type", function (done) {
            let prepareAuthRequest: Promise<string> = implicitFlowService.PrepareAuthenticationRequest();
            prepareAuthRequest.then((authRequest) => {
                expect(authRequest).toContain("response_type");
                done();
            });
        });

        it("prepares an authentication request that contains the desired response_type value", function (done) {
            let prepareAuthRequest: Promise<string> = implicitFlowService.PrepareAuthenticationRequest();
            prepareAuthRequest.then((authRequest) => {
                let responseTypeValue: string = UriHelper.GetParameterByName("response_type", authRequest);
                expect(responseTypeValue).toBe(clientModel.ResponseType);
                done();
            });
        });

        it("prepares an authentication request that contains the REQUIRED redirect_uri", function (done) {
            let prepareAuthRequest: Promise<string> = implicitFlowService.PrepareAuthenticationRequest();
            prepareAuthRequest.then((authRequest) => {
                expect(authRequest).toContain("redirect_uri");
                done();
            });
        });

        it("prepares an authentication request that contains the desired redirect_uri value", function (done) {
            let prepareAuthRequest: Promise<string> = implicitFlowService.PrepareAuthenticationRequest();
            prepareAuthRequest.then((authRequest) => {
                let responseTypeValue: string = UriHelper.GetParameterByName("redirect_uri", authRequest);
                expect(responseTypeValue).toContain(clientModel.RedirectUri);
                done();
            });
        });

        it("prepares an authentication request that contains the REQUIRED nonce", function (done) {
            let prepareAuthRequest: Promise<string> = implicitFlowService.PrepareAuthenticationRequest();
            prepareAuthRequest.then((authRequest) => {
                expect(authRequest).toContain("nonce");
                done();
            });
        });

        it("prepares an authentication request that contains the desired response_type value", function (done) {
            let prepareAuthRequest: Promise<string> = implicitFlowService.PrepareAuthenticationRequest();
            prepareAuthRequest.then((authRequest) => {
                let responseTypeValue: string = UriHelper.GetParameterByName("nonce", authRequest);
                expect(responseTypeValue).toBe(clientModel.Nonce);
                done();
            });
        });
    });

    describe("the call to SendRequestToAuthorizationServer", function () {

        it("redirects the windows to the appropriate href", function () {
            spyOn(windowService, "SetHref");
            implicitFlowService.SendRequestToAuthorizationServer("some_uri");
            expect(windowService.SetHref).toHaveBeenCalledWith("some_uri");
        });
    });

    describe("the call to ValidateIdTokenAndRetrieveSubjectIdentifier", function () {

        beforeEach(function () {
            spyOn(openIdResponseParser, "ParseWindowLocation").and.returnValue(new OpenIdResponseModel());
            spyOn(tokenParser, "ValidateIdToken").and.callFake(() => {});

        });

        it("returns a UserInfoModel that includes the End-User's Subject Identifier", function () {
            spyOn(tokenParser, "DecodeIdToken").and.returnValue(<IdTokenModel>{
                Sub: "123",
            });
            let result: UserInfoModel = implicitFlowService.ValidateIdTokenAndRetrieveSubjectIdentifier();
            // expect(result.IdToken.Sub).toBe("123");
        });
    });

    describe("the call to ValidateIdTokenAndRetrieveSubjectIdentifier", function () {

        beforeEach(function () {
            spyOn(tokenParser, "DecodeIdToken").and.callFake(() => { });
            spyOn(openIdResponseParser, "ParseWindowLocation").and.returnValue(new OpenIdResponseModel());
        });

        it("throws exception when the id_token is invalid", function () {
            spyOn(tokenParser, "ValidateIdToken").and.throwError("some error");
            function wrapper() {
                implicitFlowService.ValidateIdTokenAndRetrieveSubjectIdentifier();
            }

            expect(wrapper).toThrow();
        });

        it("does not throw an exception when the id_token is valid", function () {
            spyOn(tokenParser, "ValidateIdToken").and.callFake(() => { });

            function wrapper() {
                implicitFlowService.ValidateIdTokenAndRetrieveSubjectIdentifier();
            }

            expect(wrapper).not.toThrow();
        });
    });
});
