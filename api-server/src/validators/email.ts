import RegexValidator from "./regex-validator";

class EmailValidator extends RegexValidator
{
    protected override get regex() : RegExp 
    {
        return /^(\S+)@((?:(?:(?!-)[a-zA-Z0-9-]{1,62}[a-zA-Z0-9])\.)+[a-zA-Z0-9]{2,12})$/;
    }

    protected override get type() : string 
    {
        return "email";
    }
}

export default EmailValidator;