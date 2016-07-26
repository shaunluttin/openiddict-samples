import { AccessTokenModel } from "./access-token-model";
import { IdTokenModel } from "./id-token-model";

export class StorageService {

    private accessTokenKey: string = "access_token";
    private idTokenKey: string = "id_token";

    public get AccessTokenKey() {
        return this.accessTokenKey;
    }

    public get IdTokenKey() {
        return this.idTokenKey;
    }

    public SetAccessToken(accessToken: AccessTokenModel) {
        localStorage.setItem(this.accessTokenKey, accessToken.RawJwt);
    }

    public GetAccessToken(): string {
        return localStorage.getItem(this.accessTokenKey);
    }

    public SetIdToken(idToken: IdTokenModel) {
        localStorage.setItem(this.idTokenKey, idToken.RawJwt);
    }

    public GetIdToken(): string {
        return localStorage.getItem(this.idTokenKey);
    }

    public ClearStorageServiceItems() {
        localStorage.removeItem(this.AccessTokenKey);
        localStorage.removeItem(this.IdTokenKey);
    }
}
