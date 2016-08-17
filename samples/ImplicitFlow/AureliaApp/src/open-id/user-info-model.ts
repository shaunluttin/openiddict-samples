import { IdTokenModel } from "./id-token-model";

export class UserInfoModel {

    public IdToken: IdTokenModel;

    public AccessToken: string;

    public get Email(): string {
        return this.IdToken.Email;
    }
}
