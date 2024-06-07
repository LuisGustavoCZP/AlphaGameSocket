import * as http from "http";
import { AddressInfo } from "net";
import { port } from "./configs";

export class Server 
{
    public instance : http.Server;

    constructor (app: any)
    {
        this.instance = http.createServer(app);
    }

    public listen (callback?: (host: string) => any)
    {
        this.instance.listen(port, () =>
        {
            const a = this.instance.address() as AddressInfo;
            const host = `http://${(a.address=='::'?'localhost':a.address)}:${port}`; //process.env.GAME_HOST
            if(callback) callback(host);
        });
    }
}