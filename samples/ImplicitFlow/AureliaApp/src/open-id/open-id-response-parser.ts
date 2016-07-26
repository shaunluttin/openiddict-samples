import { UriHelper } from "./uri-helper";
import { OpenIdResponseModel } from "./open-id-response-model";

export class OpenIdResponseParser {
    public ParseWindowLocation(location: Location): OpenIdResponseModel {
        let hash = location.hash;

        // turn the hash into a query string
        // because that is what GetParameterByName expects.
        let queryString = "&" + hash.substr(1);

        let response: OpenIdResponseModel =
            {
                AccessToken: UriHelper.GetParameterByName("access_token", queryString),
                ExpiresIn: UriHelper.GetParameterByName("expires_in", queryString),
                IdToken: UriHelper.GetParameterByName("id_token", queryString),
                State: UriHelper.GetParameterByName("state", queryString),
                TokenType: UriHelper.GetParameterByName("token_type", queryString),
            };

        return response;
    }
}
