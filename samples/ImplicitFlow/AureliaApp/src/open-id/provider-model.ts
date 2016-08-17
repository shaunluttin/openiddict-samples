import { autoinject } from "aurelia-framework";
import { StorageService } from "./storage-service";

@autoinject
export class ProviderModel {

    public Scheme = "http://";
    public OpenIdAuthority: string = "zamboni-auth.azurewebsites.net"; // "localhost:12345";
    public OpenIdConfigInfoPath: string = "/.well-known/openid-configuration";
    public GrantTypesSupported: string[];
    public IdTokenSigningAlgValuesSupported: string[];
    public ResponseModesSupported: string[];
    public ResponseTypesSupported: string[];
    public ScopesSupported: string[];
    public SubjectTypesSupported: string[];
    public TokenEndpoint: string;

    constructor(private storageService: StorageService) { }

    public GetAuthorizationEndpoint(): string {
        return this.storageService.GetItem("authorization_endpoint");
    }

    public SetAuthorizationEndpoint(value: string) {
        this.storageService.SetItem("authorization_endpoint", value);
    }

    public GetIssuer(): string {
        return this.storageService.GetItem("issuer");
    }

    public SetIssuer(value: string) {
        this.storageService.SetItem("issuer", value);
    }

    public JwksUri: string;
    public EndSessionEndpoint: string;
    public UserInfoEndpoint: string;

    public get ConfigurationInformationUri(): string {
        return this.Scheme
            + this.OpenIdAuthority
            + this.OpenIdConfigInfoPath;
    }
}