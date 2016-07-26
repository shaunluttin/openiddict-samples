import { OpenId } from "./open-id/open-id";
export declare class Login {
    private openId;
    private message;
    private isLoggedIn;
    constructor(openId: OpenId);
    private login();
    private logout();
}
