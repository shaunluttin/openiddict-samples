export class MockPromises {
    public static ConfigurationInformationUriResponse: Promise<any> = new Promise(function (resolve, reject) {
        let fetchResponse = {
            json: function () {
                return {
                    authorization_endpoint: "dummy_authorization_endpoint",
                    end_session_endpoint: "dummy_end_session_endpoint",
                };
            },
        };
        resolve(fetchResponse);
    });

    public static PrepareAuthenticationRequest: Promise<any> = new Promise(function (resolve, reject) {
        resolve("dummy_authentication_request");
    });

    public static CreateLogoutUri: Promise<any> = new Promise(function (resolve, reject) {
        resolve("dummy_logout_uri");
    });
}
