import { IUserLogin } from "../models";
import NameValidator from "./name";
import PassValidator from "./password";

class UserDataValidator 
{
    public data: Partial<IUserLogin>;
    public errors: string;

    public constructor (user: IUserLogin)
    {
        this.errors = "";
        this.data = this.validate(user);
    }

    public validate (user: IUserLogin) : Partial<IUserLogin>
    {
        const validName = new NameValidator(user.username);
        const validPass = new PassValidator(user.password);

        this.errors = this.errors.concat(`${validName.errors}${validPass.errors}`)
    
        const userData: Partial<IUserLogin> = {
            username:validName.data,
            password:validPass.data,
        }

        return userData;
    }
}

export default UserDataValidator;