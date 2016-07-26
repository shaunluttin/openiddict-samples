export class ClientModel {
    public Scheme: string = "http://";
    public ClientAuthority: string = "localhost:9000";
    public ClientId: string = "myClient";
    public ResponseType: string = "id_token token";
    public RedirectPath: string = "/signin-oidc";
    public PostLogoutRedirectPath: string = "/signout-oidc";
    public Scopes: string = "openid email profile";
    public Nonce: string = "this_is_not_a_real_nonce"; // TODO Determine the nonce purpose and fulfill that purpose. 
    public State: string = "this_is_not_a_real_state"; // TODO Validate the state to prevent XSRF attacks.

    public get RedirectUri(): string {
        return this.Scheme
            + this.ClientAuthority
            + this.RedirectPath;
    }

    public get PostLogoutRedirectUri(): string {
        return this.Scheme
            + this.ClientAuthority
            + this.PostLogoutRedirectPath;
    }
}
