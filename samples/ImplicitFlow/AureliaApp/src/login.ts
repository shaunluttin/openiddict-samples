import { autoinject } from "aurelia-framework";
import { OpenId } from "./open-id/open-id";

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
