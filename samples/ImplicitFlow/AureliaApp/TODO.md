
# TODO

* Remove IoC from the tests, because when we're instantiating entire object graphs, we're no longer testing in isolation. Use <Casting> instead. 

* Copy the Mvc.Server from @PinpointTownes existing sample (except for the Startup), because then we can re-copy whenever there are breaking changes. 

* Add a psuedo refresh token flow, for when the user's access_token expires.
  * Use "prompt=none" authorization requests
  * Same thing as the original request with prompt=none
  * Do this in an iFrame, so it is transparent to the end-user.

* Integrate openid-client.js from https://github.com/IdentityModel/oidc-client-js 
  * Do this once we reach 80% test coverage for "Statements", "Functions", or "Lines".

# Other Ideas

* Upgrade TypeScript to enter the world of async/await.

* Consolidate the `export` statements into a single file, because referencing individual files (in the tests, for instance) is a nusance.