import StringValidator from "./string-validator";

class DateValidator extends StringValidator
{
    protected override get type() : string 
    {
        return "date";
    }

    protected override validate (date: string) : string
    {
        if(!super.validate(date))
        {
            return "";
        }

        if(!new Date(date).getTime())
        {
            this.errors = this.errors += `${this.type}:field is invalid|`;
            return "";
        }

        return date.trim();
    }
}

export default DateValidator;