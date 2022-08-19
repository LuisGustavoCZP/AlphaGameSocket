import * as http from "http";
import * as https from "https";
import { AddressInfo } from "net";
import { certs, isSsl, port } from "./configs";

export class Server 
{
    public instance : http.Server | https.Server;

    constructor (app: any)
    {
        this.instance = isSsl ? https.createServer(certs, app) : http.createServer(app);
    }

    public listen ()
    {
        this.instance.listen(port, () =>
        {
            const a = this.instance.address() as AddressInfo;
            console.log(`> Server listening on http${isSsl?'s':''}://${a.address=='::'?'localhost':a.address}:${port}`);
        });
    }
}