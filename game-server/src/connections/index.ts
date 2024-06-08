import { Server } from "../server";
import { v4 as uuid } from "uuid";
import { WebSocket, WebSocketServer } from "ws";
import { SocketEvent, SocketMessage } from "./models";
import { gameManager, GameManager } from "../controllers/game";
import { waitTime } from "../utils/wait";

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
    #events : Map<string, SocketEvent>

    constructor (wsocket : WebSocket)
    {
        this.id = null as any;
        this.#socket = wsocket;
        this.#events = new Map<string, SocketEvent>();
        /* this.send("connected", this.id); */
        this.#socket.on("message", (resp : string) => this.message(resp));
        this.#socket.on("ping", (resp : string) =>  setTimeout(() => this.#socket.pong(), 100));
        this.#socket.on("pong", (resp : string) => setTimeout(() => this.#socket.ping(), 100));
        this.on("player-init", async (id) => 
        {
            if(!id)
            {
                this.#socket.close();
                return;
            }
            this.id = id;
            const init = await gameManager.initPlayer(id, this);
            if(!init)
            {
                this.#socket.close();
                return;
            }
            connections.list.set(this.id, this);
            this.onclose(() =>
            {
                connections.list.delete(this.id);
            });
            console.log("Player initiate", id);
        });
    }

    send (type : string, data : any)
    {
        const msg = {
            type,
            data,
            date:Date.now()
        }
        //console.log(type, data);
        this.#socket.send(JSON.stringify(msg));
    }

    message (resp : string)
    {
        try {
            const msg = JSON.parse(resp) as SocketMessage;
            //console.log(this.events);
            if(!this.#events.has(msg.type)) return;
            const event = this.#events.get(msg.type)!;
            event(msg.data, this.id);
        } catch (error) 
        {
            this.close("A mensagem enviada não é suportada!", ConnectionStatus.Unsuported);   
        }
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

    close (message? : string, status : ConnectionStatus = ConnectionStatus.Normal)
    {
        this.#socket.close(status, message);
    }

    retry ()
    {
        this.#socket = new WebSocket(this.#socket.url);
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
        this.instance = new WebSocketServer({server:server.instance, path: "/game"});
        this.instance.on('connection', (wsocket)  => 
        {
            new Connection(wsocket);
        });
    }
}

const connections = new Connections ();

export { connections, SocketEvent, SocketMessage };