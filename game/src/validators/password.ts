import RegexValidator from "./regex-validator";
import { validatorConfig } from "../configs";

class PasswordValidator extends RegexValidator
{
    protected override get regex() : RegExp 
    {
        return /^([a-zA-Z0-9]{1,})$/;
    }

    protected override get type() : string 
    {
        return "password";
    }

    protected override validate (info: string) : string
    {
        let validInfo = super.validate(info);
        if(!validInfo)
        {
            return "";
        }

        if(validInfo.length < validatorConfig.password.min) 
        {
            this.errors = this.errors += `${this.type}:field is too short|`;
            return "";
        }

        if(validInfo.length > validatorConfig.password.max) 
        {
            this.errors = this.errors += `${this.type}:field is too long|`;
            return "";
        }

        return validInfo;
    }
}

export default PasswordValidator;