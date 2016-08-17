import { StorageService } from "../../../src/open-id/storage-service";
import { IdTokenModel } from "../../../src/open-id/id-token-model";

describe("the StorageService", function () {

    let storageService: StorageService = new StorageService();

    let accessToken: string = "dummy_access_token";

    let idToken: IdTokenModel = <IdTokenModel>{
        RawJwt: "dummy_id_token",
    };

    it("sets the access token", function () {
        storageService.SetAccessToken(accessToken);

        let result = localStorage.getItem(storageService.AccessTokenKey);
        expect(result).toBe(accessToken);
    });

    it("gets the access token if one is available", function () {
        localStorage.setItem(storageService.AccessTokenKey, accessToken);

        let result = storageService.GetAccessToken();
        expect(result).toBe(accessToken);
    });

    it("sets the id token", function () {
        storageService.SetIdToken(idToken);

        let result = localStorage.getItem(storageService.IdTokenKey);
        expect(result).toBe(idToken.RawJwt);
    });

    it("gets the id token if one is available", function () {
        localStorage.setItem(storageService.IdTokenKey, idToken.RawJwt);

        let result = storageService.GetIdToken();
        expect(result).toBe(idToken.RawJwt);
    });

    it("clears all of the tokens that it manages while leaving others", function () {
        storageService.SetAccessToken(accessToken);
        storageService.SetIdToken(idToken);
        localStorage.setItem("some_other_key", "some_other_value");

        storageService.ClearStorageServiceItems();
        let result1 = storageService.GetAccessToken();
        let result2 = storageService.GetIdToken();
        let result3 = localStorage.getItem("some_other_key");

        expect(result1).toBeNull();
        expect(result2).toBeNull();
        expect(result3).toBe("some_other_value");
    });
});

