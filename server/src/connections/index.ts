import { Server } from "../server";
import { v4 as uuid } from "uuid";
import { WebSocket, WebSocketServer } from "ws";
import { port } from "../configs";
import { SocketEvent, SocketMessage } from "./models";
import { matchController } from "../controllers";
import { match } from "assert";

export enum ConnectionStatus
{
    Normal = 1000,
    Away = 1001,
    Protocol = 1002,
    Unsuported = 1003,
    Abnormal = 1006,
    Invalid = 1007,
    Restart = 1012,
    Unauthorized = 3000
}

export class Connection 
{
    id : string;
    #socket : WebSocket;
    #events : Map<string, SocketEvent>;
    userid : string;

    constructor (wsocket : WebSocket, userid:string)
    {
        this.id = uuid();
        this.userid = userid;
        this.#socket = wsocket;
        this.#events = new Map<string, SocketEvent>();
        //this.send("connected", this.id);
        
        this.#socket.on("message", (resp : string) => this.message(resp));
        
        /* this.on("match-init", async () => 
        {
            const matchid = 
        }); */
    }

    close (message? : string, status : ConnectionStatus = ConnectionStatus.Normal)
    {
        this.#socket.close(status, message);
    }

    send (type : string, data : any)
    {
        const msg = {
            type,
            data,
            date:Date.now()
        }
        console.log(type, data);
        this.#socket.send(JSON.stringify(msg));
    }

    message (resp : string)
    {
        const msg = JSON.parse(resp) as SocketMessage;
        console.log(msg);
        if(!this.#events.has(msg.type)) return;
        const event = this.#events.get(msg.type)!;
        event(msg.data, this.id);
    }

    on (type : string, event : SocketEvent)
    {
        this.#events.set(type, event);
    }

    off (type : string)
    {
        if(this.#events.has(type)) 
        {
            return this.#events.delete(type);
        }
        return false;
    }

    onclose (event : SocketEvent)
    {
        this.#socket.on("close", event);
    }
}

export class Connections
{
    instance : WebSocketServer;
    list : Map<string, Connection>;

    public constructor()
    {
        this.list = new Map<string, any>();
        this.instance = null as any;
    }

    public start (server? : Server)
    {
        const options = server ? {server:server.instance} : {port:port+10};
        this.instance = new WebSocketServer(options);
        this.instance.on('connection', (wsocket)  => 
        {
            wsocket.on('message', (msg : {type:string, data:any}) => 
            {
                const msgData = JSON.parse(msg.toString());
                if(msgData.type == "auth")
                {
                    const connection = new Connection(wsocket, msgData.data);
                    this.list.set(connection.id, connection);
                    connection.onclose(async () =>
                    {
                        this.list.delete(connection.id);
                        await matchController.removePlayer(connection.userid);
                    });

                    connection.send("auth", connection.id);
                    matchController.newPlayer(connection);
                }
            });
        });
    }
}

const connectionManager = new Connections ();
//const gameManager = new Connections ();

export { connectionManager/* , gameManager */ }
