import { autoinject } from "aurelia-framework";
import { OpenIdResponseModel } from "./open-id-response-model";
import { HttpDiscoveryService } from "./http-discovery-service";
import { IdTokenModel } from "./id-token-model";
import { OpenIdResponseParser } from "./open-id-response-parser";
import { TokenParser } from "./token-parser";
import { StorageService } from "./storage-service";
import { ProviderModel } from "./provider-model";
import { UserInfoModel } from "./user-info-model";
import { WindowService } from "./window-service";

@autoinject
export class ImplicitFlowService {

    constructor(
        private httpDiscoveryService: HttpDiscoveryService,
        private openIdResponseParser: OpenIdResponseParser,
        private tokenParser: TokenParser,
        private storageService: StorageService,
        private providerModel: ProviderModel,
        private windowService: WindowService) { }

    // Implicit Flow Step #1
    // Client prepares an Authentication Request containing the desired request parameters.
    public PrepareAuthenticationRequest(): Promise<string> {
        return this.httpDiscoveryService.CreateAuthenticationRequestUri();
    }

    // Implicit Flow Step #2
    // Client sends the request to the Authorization Server. 
    public SendRequestToAuthorizationServer(authenticationRequest: string) {
        this.windowService.SetHref(authenticationRequest);
    }

    // Implicit Flow Step #6
    // Client validates the ID token and retrieves the End-User's Subject Identifier.  
    public ValidateIdTokenAndRetrieveSubjectIdentifier(): UserInfoModel {

        let location: Location = this.windowService.GetLocation();
        let openIdResponse: OpenIdResponseModel = this.openIdResponseParser.ParseWindowLocation(location);

        let idToken: IdTokenModel = this.tokenParser.DecodeIdToken(openIdResponse);

        this.tokenParser.ValidateIdToken(idToken, this.providerModel);

        let userInfo = new UserInfoModel();
        userInfo.IdToken = idToken;
        userInfo.AccessToken = openIdResponse.AccessToken;
        return userInfo;
    }
}
