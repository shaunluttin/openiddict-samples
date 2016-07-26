import { WindowService } from "../../../src/open-id/window-service";
import { OpenIdResponseParser } from "../../../src/open-id/open-id-response-parser";

describe("the OpenIdResponseParser", function () {

    let openIdResponseParser: OpenIdResponseParser = new OpenIdResponseParser();
    let windowService: WindowService = new WindowService(window);

    let DummyAccessToken = "dummy_access_token";
    let DummyIdToken = "dummy_id_token";

    it("populates an access_token if the window location hash has one", function () {
        let location: Location = windowService.GetLocation();
        location.hash = `#access_token=${DummyAccessToken}`;

        let openIdResponse = openIdResponseParser.ParseWindowLocation(location);

        expect(openIdResponse.AccessToken).toBe(DummyAccessToken);
    });

    it("populates an id_token if the window location hash has one", function () {
        let location: Location = windowService.GetLocation();
        location.hash =
            `#access_token=${DummyAccessToken}&id_token=${DummyIdToken}`;

        let openIdResponse = openIdResponseParser.ParseWindowLocation(location);

        expect(openIdResponse.IdToken).toBe(DummyIdToken);
    });
});
