export class ProviderModel {
    public Scheme = "http://";
    public OpenIdAuthority: string = "localhost:12345";
    public OpenIdConfigInfoPath: string = "/.well-known/openid-configuration";
    public AuthorizationEndpoint: string;
    public EndSessionEndpoint: string;
    public GrantTypesSupported: string[];
    public IdTokenSigningAlgValuesSupported: string[];
    public Issuer: string;
    public JwksUri: string;
    public ResponseModesSupported: string[];
    public ResponseTypesSupported: string[];
    public ScopesSupported: string[];
    public SubjectTypesSupported: string[];
    public TokenEndpoint: string;
    public UserInfoEndpoint: string;

    public get ConfigurationInformationUri(): string {
        return this.Scheme
            + this.OpenIdAuthority
            + this.OpenIdConfigInfoPath;
    }
}