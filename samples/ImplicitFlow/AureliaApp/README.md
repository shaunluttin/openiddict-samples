# Overview 

This plugin handles the implicit flow with Openiddict.

See http://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowSteps

1. Discovers the Authorization Server's configuration information.
1. Redirect to the Authorization Server.
1. Handles the Authorization Server's response.
1. Validates the ID Token and retrieves the end-users subject ID

# Package installation and usuage 

1. `npm install aurelia-cli -g`
1. `au new aurelia-openiddict-test` // choose TypeScript and then defaults
1. `cd aurelia-openiddict-test`
1. `npm install aurelia-openiddict`
1. `code .` // open in Visual Studio Code or other editor
1. Manually add dependencies to aurelia_project/aurelia.json 
1. Install custom typings for the `aurelia-fetch-client` 
    * `typings install dt~whatwg-fetch --global --save-dev`
    * `New-Item -Type File custom_typings/url-search-params.d.ts -Value "interface URLSearchParams {}"`
1. Add a login.ts/html module (see below)
1. Add the plugin in main.ts (see below)
1. Configure the router in app.ts (see below)

aurelia.json dependencies

    "aurelia-fetch-client",
    {
      "name": "jwt-decode",
      "path": "../node_modules/jwt-decode/lib",
      "main": "index"
    },
    {
      "name": "aurelia-openiddict",
      "path": "../node_modules/aurelia-openiddict/scripts/open-id/",
      "main": "index"
    },

login.html

    <template>
      <a show.bind='!isLoggedIn' href="#" click.trigger="login()">Log in</a>
      <a show.bind='isLoggedIn' href="#" click.trigger="logout()">Log out</a>
      <p>${message}</p>
    </template>

login.ts

    import { autoinject } from "aurelia-framework";
    import { OpenId } from "aurelia-openiddict";

    @autoinject
    export class Login {

        private message: string;
        private isLoggedIn: boolean = false;

        constructor(private openId: OpenId) {
            this.isLoggedIn = this.openId.IsLoggedIn();
            if (this.isLoggedIn) {
                this.message = this.openId.User.Email;
            }
        }

        private login() {
            this.openId.Login();
        }

        private logout() {
            this.openId.Logout();
        }
    }

main.ts

    plugin("aurelia-openiddict")

app.html

    <template>
        <router-view></router-view>
    </template>

app.ts

    import { autoinject } from "aurelia-framework";
    import { RouterConfiguration, Router } from "aurelia-router";
    import { OpenId, OpenIdConfiguration } from "aurelia-openiddict";

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

# Development 

### Run

    npm install aurelia-cli -g
    typings install // otherwise the compiler will complain
    au run --watch

Note: start the Authorization Server first.

### Test

    au test
    firefox coverage

### Develop

    npm install -y
    typings install
