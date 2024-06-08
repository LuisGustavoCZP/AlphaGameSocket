import express, { Express } from 'express';
import * as http from "http";
import { AddressInfo } from "net";
import { port } from "./configs";

export class Server 
{
    public instance : http.Server;

    constructor (callback: (data: {server: http.Server, app: Express}) => void)
    {
        const app = express();
        const server = http.createServer(app);
        
        this.instance = server;
        if(callback) callback({server, app});
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