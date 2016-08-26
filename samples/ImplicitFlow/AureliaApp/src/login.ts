import { autoinject } from "aurelia-framework";
import { OpenId, User } from "./open-id/open-id";
import { HttpClient } from "aurelia-fetch-client";

@autoinject
export class Login {

    private authorizationServerMessage: string;
    private resourceServerMessage: string;
    private isLoggedIn: boolean = false;

    constructor(private openId: OpenId, private httpClient: HttpClient) {
        this.openId.UserManager.getUser().then((user: User) => {

            console.log(user);
            if (user === null || user === undefined) {
                return;
            }

            console.log("logged in");
            this.isLoggedIn = true;
            this.authorizationServerMessage = JSON.stringify(user, null, 4);

            console.log("login constructor done");
        });
    }

    private login() {
        this.openId.Login();
    }

    private logout() {
        this.openId.Logout();
    }

    private queryResourceServer(serverNum: number) {

        this.openId.UserManager.getUser().then((user: User) => {

            if (user === null || user === undefined) {
                return;
            }

            let fetchHeaders = new Headers();
            fetchHeaders.append("Authorization", `Bearer ${user.access_token}`);

            let fetchInit = {
                headers: fetchHeaders,
            };

            let url: string;

            if(window.location.hostname === "localhost") {
                url = serverNum === 1
                   ? "http://localhost:5001/api/message"
                   : "http://localhost:5002/api/message";
            } else {
                url = serverNum === 1
                   ? "http://zamboni-resource-01.azurewebsites.net/api/message"
                   : "http://zamboni-resource-02.azurewebsites.net/api/message";
            }

            this.httpClient.fetch(url, fetchInit)
                .then((response) => response.text())
                .then((data) => {
                    this.resourceServerMessage = data;
                })
                .catch((err) => {
                    this.resourceServerMessage = err.message;
                });
        });
    }
}
