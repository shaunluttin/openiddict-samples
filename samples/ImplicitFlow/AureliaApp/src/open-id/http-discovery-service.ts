import { HttpClient } from "aurelia-fetch-client";
import { autoinject } from "aurelia-framework";
import { ClientModel } from "./client-model";
import { ProviderModel } from "./provider-model";

@autoinject
export class HttpDiscoveryService {

    public get Provider(): ProviderModel {
        return this.providerModel;
    }

    public get Client(): ClientModel {
        return this.clientModel;
    }

    constructor(
        private httpClient: HttpClient,
        private providerModel: ProviderModel,
        private clientModel: ClientModel) { }

    public get ConfigurationInformationUri(): string {
        return this.providerModel.Scheme
            + this.providerModel.OpenIdAuthority
            + this.providerModel.OpenIdConfigInfoPath;
    }

    // See http://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig
    public ObtainOpenIdProviderConfigurationInformation(): Promise<string> {

        return this.httpClient.fetch(this.ConfigurationInformationUri)
            .then(response => response.json())
            .then(data => {
                this.providerModel.Issuer = data.issuer;
                this.providerModel.AuthorizationEndpoint = data.authorization_endpoint;
                this.providerModel.JwksUri = data.jwks_uri;
                this.providerModel.EndSessionEndpoint = data.end_session_endpoint;
                this.providerModel.UserInfoEndpoint = data.userinfo_endpoint;
                // TODO Set the following string array properties.
                // code_challenge_methods_supported
                // grant_types_supported
                // response_modes_supported
                // response_types_supported
                // subject_types_supported
                // scopes_supported
                // id_token_signing_alg_values_supported
                return "The provider is ready for use.";
            });
    }

    public CreateAuthenticationRequestUri(): Promise<string> {

        // TODO Make this lazy and cache the result. 

        return this.ObtainOpenIdProviderConfigurationInformation()
            .then(() => this.providerModel.AuthorizationEndpoint
                + `?client_id=${this.clientModel.ClientId}`
                + `&response_type=${this.clientModel.ResponseType}`
                + `&redirect_uri=${this.clientModel.RedirectUri}`
                + `&scope=${this.clientModel.Scopes}`
                + `&nonce=${this.clientModel.Nonce}`
                + `&state=${this.clientModel.State}`);
    }

    public CreateLogoutUri(): Promise<string> {

        // TODO Make this lazy and cache the result. 

        return this.ObtainOpenIdProviderConfigurationInformation()
            .then(() => this.providerModel.EndSessionEndpoint
                + `?post_logout_redirect_uri=${this.clientModel.PostLogoutRedirectUri}`);
    }
}
