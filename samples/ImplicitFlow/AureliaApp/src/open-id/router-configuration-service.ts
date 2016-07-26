import { autoinject } from "aurelia-framework";
import { ClientModel } from "./client-model";
import { OpenIdConfiguration } from "./open-id-configuration";
import { RouterConfiguration, RouteConfig, NavigationInstruction } from "aurelia-router";

@autoinject
export class RouterConfigurationService {

    private loginRedirectHandler: Function;
    private logoutRedirectHandler: Function;

    constructor(private clientModel: ClientModel) { }

    public ConfigureRouter(
        routerConfiguration: RouterConfiguration,
        openIdConfiguration: OpenIdConfiguration,
        loginRedirectHandler: Function,
        logoutRedirectHandler: Function) {

        this.loginRedirectHandler = loginRedirectHandler;
        this.logoutRedirectHandler = logoutRedirectHandler;

        let loginRedirectRoute: RouteConfig = {
            name: "openIdRedirectRoute",
            navigationStrategy: (instruction: NavigationInstruction) => {
                this.loginRedirectHandler();
                instruction.config.moduleId = openIdConfiguration.LoginRedirectModuleId;
            },
            route: this.clientModel.RedirectPath,
        };

        let logoutRedirectRoute: RouteConfig = {
            name: "openIdPostLogoutRedirectRoute",
            navigationStrategy: (instruction: NavigationInstruction) => {
                this.logoutRedirectHandler();
                instruction.config.moduleId = openIdConfiguration.LogoutRedirectModuleId;
            },
            route: this.clientModel.PostLogoutRedirectPath,
        };

        routerConfiguration.mapRoute(loginRedirectRoute);
        routerConfiguration.mapRoute(logoutRedirectRoute);
    }
}
