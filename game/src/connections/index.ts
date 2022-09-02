import { Server } from "../server";
import { v4 as uuid } from "uuid";
import { WebSocket, WebSocketServer } from "ws";
import { SocketEvent, SocketMessage } from "./models";
import { gameManager, GameManager } from "../controllers/game";

export class Connection 
{
    id : string;
    #socket : WebSocket;
    #events : Map<string, SocketEvent>

    constructor (wsocket : WebSocket)
    {
        this.id = uuid();
        this.#socket = wsocket;
        this.#events = new Map<string, SocketEvent>();
        this.send("connected", this.id);
        this.#socket.on("message", (resp : string) => this.message(resp));
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
        //console.log(this.events);
        if(!this.#events.has(msg.type)) return;
        const event = this.#events.get(msg.type)!;
        event(msg.data);
    }

    add (type : string, event : SocketEvent)
    {
        this.#events.set(type, event);
    }

    remove (type : string)
    {
        if(this.#events.has(type)) 
        {
            return this.#events.delete(type);
        }
        return false;
    }
}

export class Connections
{
    instance : WebSocketServer;
    list : Map<string, Connection>;

    constructor()
    {
        this.list = new Map<string, any>();
        this.instance = (null as unknown) as WebSocketServer;
    }

    start (server : Server)
    {
        this.instance = new WebSocketServer({server:server.instance});
        this.instance.on('connection', (wsocket)  => 
        {
            const connection = new Connection(wsocket);
            this.list.set(connection.id, connection);
            gameManager.addPlayer(connection);
            wsocket.on("close", () =>
            {
                this.list.delete(connection.id);
            });
        });
    }
}

const connections = new Connections ();

export {connections};