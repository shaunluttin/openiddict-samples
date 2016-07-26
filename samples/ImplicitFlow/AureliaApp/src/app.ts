import { autoinject } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import { OpenId, OpenIdConfiguration } from "./open-id/open-id";

@autoinject
export class App {

    public openId: OpenId;

    constructor(openId: OpenId) {
        this.openId = openId;
    }

    public configureRouter(routerConfiguration: RouterConfiguration, router: Router) {

        // switch from hash (#) to slash (/) navigation
        routerConfiguration.options.pushState = true;

        // configure routes
        routerConfiguration.map([
            { moduleId: "login", route: ["", "login"] },
        ]);

        // configure open id
        let openIdConfiguration: OpenIdConfiguration = {
            LoginRedirectModuleId: "login",
            LogoutRedirectModuleId: "login",
        };

        this.openId.Configure(routerConfiguration, openIdConfiguration);
    }
}
