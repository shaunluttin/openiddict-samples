import { autoinject } from "aurelia-framework";
import { OpenIdConnect } from "aurelia-open-id-connect";
import { User } from "oidc-client";
import { HttpClient } from "aurelia-fetch-client";
import environment from "./environment";

@autoinject
export class Home {

    public isLoggedIn: boolean;

    private secondsUntilAccessTokenExpires: number;
    private currentTimeInSeconds: number;
    private resourceServerMessage: Array<string> = new Array<string>();
    private inMemoryUser: User;

    private get environmentAsJson(): string {
        return JSON.stringify(environment, null, 4);
    }

    private get userAsJson(): string {
        return JSON.stringify(this.inMemoryUser, null, 4);
    };

    constructor(private openIdConnect: OpenIdConnect, private httpClient: HttpClient) {
        this.initializeCountdownClock();
        this.openIdConnect.observeUser((user: User) => {
            if (user) {
                this.inMemoryUser = user;
            }
        })
    }

    public queryResourceServer(serverNum: number, isPrivate: boolean) {
        let fetchUrl = this.getResourceServerUrl(serverNum, isPrivate);
        let fetchInit = this.getFetchInit();

        this.resourceServerMessage.splice(0, 0, `Fetching ${fetchUrl}\n`);
        this.resourceServerMessage.splice(1, 0, `\n`);

        this.httpClient.fetch(fetchUrl, fetchInit)
            .then((response) => response.ok ? response.text() : response.statusText)
            .then((data) => this.resourceServerMessage.splice(1, 0, `${data}\n`))
            .catch((err) => this.resourceServerMessage.splice(1, 0, `${err.message}\n`));
    }

    public loginSilent() {
        this.openIdConnect.loginSilent().catch((error) => {
            // if this is a timeout error,
            // then use a text editor to increase the silentRequestTimeout value,
            // that we configure in open-id-connect-configuration.ts
            console.log(error);
        });
    }

    private initializeCountdownClock() {

        const oneSecondInMilliseconds = 1000;

        setInterval(() => {
            this.currentTimeInSeconds =
                Math.round((new Date()).getTime() / oneSecondInMilliseconds);

            if (this.inMemoryUser) {
                this.secondsUntilAccessTokenExpires = this.inMemoryUser.expires_in;
            }

        }, oneSecondInMilliseconds);
    }

    private getFetchInit(): RequestInit {
        let fetchInit = <RequestInit>{
            headers: new Headers()
        };

        if (this.inMemoryUser != null) {
            (<Headers>fetchInit.headers)
                .append("Authorization", `Bearer ${this.inMemoryUser.access_token}`);
        }

        return fetchInit;
    }

    private getResourceServerUrl(serverNum: number, isPrivate: boolean) {
        let leftPart = serverNum === 1
            ? environment.urls.resourceServer01
            : environment.urls.resourceServer02;

        let path = isPrivate ? "private" : "public";

        return `${leftPart}/api/${path}`;
    }
}
