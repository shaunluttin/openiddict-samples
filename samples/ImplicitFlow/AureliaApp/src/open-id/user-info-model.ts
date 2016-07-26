import { IdTokenModel } from "./id-token-model";
import { AccessTokenModel } from "./access-token-model";

export class UserInfoModel {

    public IdToken: IdTokenModel;

    public AccessToken: AccessTokenModel;

    public get Email(): string {
        return this.IdToken.Email;
    }
}
