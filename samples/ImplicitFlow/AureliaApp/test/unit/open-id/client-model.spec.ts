import { ClientModel } from "../../../src/open-id/client-model";

describe("the ClientModel", function () {
    let clientModel = new ClientModel();

    it("returns a correct redirect uri", function () {

        let redirectUri = clientModel.RedirectUri;
        expect(redirectUri).toBe(clientModel.Scheme
            + clientModel.ClientAuthority
            + clientModel.RedirectPath);
    });

    it("returns a correct post logout redirect uri", function () {

        let postLogoutRedirectUri = clientModel.PostLogoutRedirectUri;
        expect(postLogoutRedirectUri).toBe(clientModel.Scheme
            + clientModel.ClientAuthority
            + clientModel.PostLogoutRedirectPath);
    });
});
