import StringValidator from "./string-validator";

abstract class RegexValidator extends StringValidator
{
    protected abstract get regex() : RegExp;

    protected override validate (info: string) : string
    {
        let validInfo = super.validate(info);
        if(!validInfo)
        {
            return "";
        }

        if(!super.validate(validInfo))
        {
            return "";
        }

        if(!this.regex.test(validInfo))
        {
            this.errors = this.errors += `${this.type}:invalid ${this.type}|`;
            return "";
        }

        return validInfo;
    }
}

export default RegexValidator;