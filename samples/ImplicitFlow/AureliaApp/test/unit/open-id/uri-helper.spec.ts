import { UriHelper } from "../../../src/open-id/uri-helper";

describe("the UriHelper", function () {

    it("gets the correct parameter by name if that parameter exists", function () {

        let uri = "http://www.domain.com/?foo=bar";
        let result = UriHelper.GetParameterByName("foo", uri);
        expect(result).toBe("bar");
    });

});

