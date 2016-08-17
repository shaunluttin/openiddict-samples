import { IdTokenModel } from "./id-token-model";
import { OpenIdResponseModel } from "./open-id-response-model";
import { ProviderModel } from "./provider-model";
import * as jwt_decode from "jwt-decode";

export class TokenParser {

    public DecodeIdToken(openIdResponse: OpenIdResponseModel): IdTokenModel {

        let obj = jwt_decode(openIdResponse.IdToken);
        let decoded: IdTokenModel = {
            AtHash: obj.at_hash,
            Aud: obj.aud,
            Azp: obj.azp,
            Email: obj.email,
            Exp: obj.exp,
            Iat: obj.iat,
            Iss: obj.iss,
            Jti: obj.jti,
            Nbf: obj.nbf,
            Nonce: obj.nonce,
            RawJwt: openIdResponse.IdToken,
            Sub: obj.sub,
            UniqueName: obj.unique_name,
            Usuage: obj.usage,
        };

        return decoded;
    }

    // http://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation
    public ValidateIdToken(idToken: IdTokenModel, providerModel: ProviderModel): boolean {
        // 1 - Not applicable, because the token is not encrypted.

        // 2
        if (idToken.Iss !== providerModel.GetIssuer()) {
            throw new Error(`${idToken.Iss} does not equal ${providerModel.GetIssuer()}.`);
        }

        // 3 TODO
        // 4 TODO
        // 5 TODO
        // 6 TODO
        // 7 TODO
        // 8 TODO
        // 9 TODO
        // 10 TODO
        // 11 TODO
        // 12 TODO
        // 13 TODO

        return true;
    }
}
