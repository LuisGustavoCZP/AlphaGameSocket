import configs from "./config";

export interface APIRequestOptions 
{
    path : string;
    method? : string;
    data? : any;
}

export interface APIRequestResponse
{
    data : any,
    error : string
}

export class APIRequest <T>
{
    options : APIRequestOptions;
    result : T;
    status : number;
    sucess : boolean;

    constructor (options : APIRequestOptions, result : T, status : number, sucess : boolean)
    {
        this.options = options;
        this.result = result;
        this.status = status;
        this.sucess = sucess;
    }

    static async execute (options : APIRequestOptions)
    {
        return await fetch(`https://${configs.server}${options.path}/`, {
            method:options.method?options.method:'GET',
            headers: 
            {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body:options.data
        })
        .then(async (resp) => 
        {
            const json = await resp.json();
            if(resp.status >= 400)
            {
                const err = new Error(json.error);
                (err as any).code = resp.status;
                throw err;
            }
            else 
            {
                const data = json.data;
                //console.log(data);
                return new APIRequest(options, data, resp.status, true);
            }
        })
        .catch(err => 
        {
            console.log(err);
            return new APIRequest(options, err, err.code, false);
        });
    }
}