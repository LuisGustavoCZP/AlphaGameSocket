import StringValidator from "./string-validator";
import { validatorConfig } from "../configs";

class NameValidator extends StringValidator
{
    protected get min () : number
    {
        return 4;
    }

    protected override get type() : string 
    {
        return "name";
    }

    protected override validate (info: string) : string
    {
        let validInfo = super.validate(info);
        if(!validInfo)
        {
            return "";
        }

        if(validInfo.length < validatorConfig.username.min) 
        {
            this.errors = this.errors += `${this.type}:field is too short|`;
            return "";
        }

        if(validInfo.length > validatorConfig.username.max) 
        {
            this.errors = this.errors += `${this.type}:field is too long|`;
            return "";
        }

        return validInfo;
    }
}

export default NameValidator;