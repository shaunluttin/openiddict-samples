import { HttpClient } from "aurelia-fetch-client";

export class DemoClass {

    constructor(private httpClient: HttpClient) { }

    public UseTheHttpClient() {
        return this.httpClient.fetch("some_url");
    }
}

describe("the DemoClass", function () {

    let httpClient: HttpClient = new HttpClient();
    let usesTheHttpClient: DemoClass = new DemoClass(httpClient);

    beforeEach(function () { // spy on that HTTP client
        spyOn(httpClient, "fetch").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve("some_fake_response");
            });
        });
    });

    it("returns the fake response", function (done) {
        usesTheHttpClient.UseTheHttpClient().then((response) => {
            expect(response).toBe("some_fake_response");
            done();
        });
    });
});
