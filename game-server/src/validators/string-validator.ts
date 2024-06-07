abstract class StringValidator
{
    public data: string;
    public errors: string;

    protected abstract get type() : string;

    public constructor (info: string)
    {
        this.errors = "";
        this.data = this.validate(info);
    }

    protected validate (info: string) : string
    {
        if(!info || info.length == 0)
        {
            this.errors = this.errors += `${this.type}:field required|`;
            return "";
        }

        const f = info.trim();
        if(!f) 
        {
            this.errors = this.errors += `${this.type}:field cannot be only spaces|`;
            return "";
        }

        return f;
    }
}

export default StringValidator;