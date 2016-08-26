import { OpenIdConfiguration, UserManagerSettings } from "./open-id/open-id";

let authority: string = window.location.host === "localhost"
    ? "http://localhost:12345"
    : "https://zamboni-auth-server.azurewebsites.net";

let host: string = window.location.host === "localhost"
    ? "http://localhost:9000"
    : "https://zamboni-app.azurewebsites.net";

const oidcConfig: OpenIdConfiguration = {
    LoginRedirectModuleId: "login",
    LogoutRedirectModuleId: "login",
    UserManagerSettings: <UserManagerSettings>{
        authority: authority,
        client_id: "Aurelia.OidcClientJs",
        post_logout_redirect_uri: `${host}/signout-oidc`,
        redirect_uri: `${host}/signin-oidc`,
        response_type: "id_token token",
        scope: "openid email roles profile",
        filterProtocolClaims: true, // TODO What is this?
        loadUserInfo: true,
    }
};

export default oidcConfig;
