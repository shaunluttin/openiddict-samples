import { Aurelia, autoinject } from "aurelia-framework";
import { RouterConfigurationService } from "./router-configuration-service";
import { RouterConfiguration } from "aurelia-router";
import { HttpDiscoveryService } from "./http-discovery-service";
import { ImplicitFlowService } from "./implicit-flow-service";
import { StorageService } from "./storage-service";
import { UserInfoModel } from "./user-info-model";
import { OpenIdConfiguration } from "./open-id-configuration";
import { WindowService } from "./window-service";

function configure(aurelia: Aurelia, callback) {
    callback();
}

@autoinject
class OpenId {

    public get User(): UserInfoModel {
        return this.user;
    }

    private user: UserInfoModel;

    constructor(
        private httpDiscoveryService: HttpDiscoveryService,
        private implicitFlowService: ImplicitFlowService,
        private routerConfigurationService: RouterConfigurationService,
        private storageService: StorageService,
        private windowService: WindowService) { }

    public Configure(routerConfiguration: RouterConfiguration, openIdConfiguration: OpenIdConfiguration) {

        // TODO throw if routerConfiguration is null
        // TODO throw is openIdConfiguration is null (maybe - do we have defaults?)
        this.routerConfigurationService.ConfigureRouter(
            routerConfiguration,
            openIdConfiguration,
            this.LoginRedirectHandler,
            this.PostLogoutRedirectHandler);
    }

    public Login() {
        let prepareAuthRequest = this.implicitFlowService.PrepareAuthenticationRequest();
        prepareAuthRequest.then((authRequest) => {
            this.implicitFlowService.SendRequestToAuthorizationServer(authRequest);
        });
    }

    public Logout() {
        let createLogoutUri = this.httpDiscoveryService.CreateLogoutUri();
        createLogoutUri.then((logoutUri) => {
            this.windowService.SetHref(logoutUri);
        });
    }

    // TODO Consider moving this into the UserInfo class.
    public IsLoggedIn() {
        return this.storageService.GetAccessToken() !== null &&
            this.user !== undefined &&
            this.user !== null;
    }

    // NOTE: This is public only to facilitate unit testing.
    public LoginRedirectHandler = () => {
        this.user = this.implicitFlowService.ValidateIdTokenAndRetrieveSubjectIdentifier();
        this.storageService.SetAccessToken(this.user.AccessToken);
        this.storageService.SetIdToken(this.user.IdToken);
    }

    // NOTE: This is public only to facilitate unit testing.
    public PostLogoutRedirectHandler = () => {
        this.storageService.ClearStorageServiceItems();
    }
}

export {
    configure,
    OpenId,
    OpenIdConfiguration,
}
