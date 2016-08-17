
# Azure App Service Usuage

Create four Web Apps. For each, go to Application settings and set the appropriate `COMMAND`.

* AuthorizationServer: deploy-implicit-auth-server.cmd
* AureliaApp: deploy-implicit-aurelia-app.cmd
* ResourceServer01: 
* ResourceServer02: 

# Local Usuage

1. Install .NET Core
2. Install NodeJS
3. Run the `RunDemo.ps1` script from PowerShell.

# Basic Idea

* Load the single page application.

* End-user clicks login.
* Redirect to the Authorization Server.
    * Authenticates the end-user either locally or with a 3rd party.
    * Generates an `access_token` for its resource servers.
    * Responds with an `access_token` and an `id_token`.

* Control returns to the single page application. 
* Display end-user profile information from the `id_token`. 

* End-user clicks "Get Resources from Server 01." 
* Query the first Resource Server with the `access_token`.

* End-user clicks "Get Resources from Server 02." 
* Query the second Resource Server with the `access_token`. 

# Miscellaneous Notes

### Some URLs to Test

* http://localhost:12345/.well-known/openid-configuration
* http://localhost:12345/connect/authorize?client_id=myClient&response_type=code&redirect_uri=http://localhost:6789/signin-oidc

### Notes on Access Token Validation 

For `access_token` validation, we will use either the second or third of the standard validation alternatives.

1. The resource server and authorization server have shared keys or share a database. 
2. Tokens use a standard format and validation happens via a public key that the resource server exposes.
3. The resource server uses token introspection to make the authorization server validate the token.

### Authorization Server

1. Authenticates its end-user either locally or with a 3rd party.
2. Generates an access token for its resource servers.
3. Exposes an introspection endpoint for its resource servers.
4. Generates an id token for its client application.
5. Stores and manages membership information in its service database.

### Third Party Authentication

We're using OAuth 2.0 and a user info endpoint instead of pure OpenID Connect, because few major services fully support OpenID Connect.