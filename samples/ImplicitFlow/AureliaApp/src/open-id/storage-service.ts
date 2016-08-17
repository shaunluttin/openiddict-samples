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

    public SetItem(key: string, data: string) {
        localStorage.setItem(key, data);
    }

    public GetItem(key: string) {
        return localStorage.getItem(key);
    }

    public SetAccessToken(accessToken: string) {
        localStorage.setItem(this.accessTokenKey, accessToken);
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
