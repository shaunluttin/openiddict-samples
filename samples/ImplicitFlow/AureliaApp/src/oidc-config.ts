import { OpenIdConfiguration, UserManagerSettings } from "./open-id/open-id";

const oidcConfig: OpenIdConfiguration = {
    LoginRedirectModuleId: "login",
    LogoutRedirectModuleId: "login",
    UserManagerSettings: <UserManagerSettings>{
        authority: "http://localhost:12345",
        client_id: "Aurelia.OidcClientJs",
        post_logout_redirect_uri: "http://localhost:9000/signout-oidc",
        redirect_uri: "http://localhost:9000/signin-oidc",
        response_type: "id_token token",
        scope: "openid email roles profile",
        filterProtocolClaims: true, // TODO What is this?
        loadUserInfo: true,
    }
};

export default oidcConfig;
