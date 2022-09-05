import { Server } from "../server";
import { v4 as uuid } from "uuid";
import { WebSocket, WebSocketServer } from "ws";
import { SocketEvent, SocketMessage } from "./models";
import { gameManager, GameManager } from "../controllers/game";
import { waitTime } from "../utils/wait";

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

        this.on("player-init", (id) => 
        {
            if(!id)
            {
                this.#socket.close();
                return;
            }
            this.id = id;
            if(!gameManager.initPlayer(id, this))
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
        console.log(type, data);
        this.#socket.send(JSON.stringify(msg));
    }

    message (resp : string)
    {
        const msg = JSON.parse(resp) as SocketMessage;
        //console.log(this.events);
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
        this.instance = new WebSocketServer({server:server.instance});
        this.instance.on('connection', (wsocket)  => 
        {
            new Connection(wsocket);
        });
    }
}

const connections = new Connections ();
//let serverManager : Connection;
let serverManager = new Connection (new WebSocket("ws://localhost:8010"));
serverManager.on("match-init", (match) => 
{
    gameManager.createMatch(match);
    serverManager.send("match-init", true);
});
serverManager.onclose(async () => 
{
    await waitTime(5000);
    serverManager.retry();
})

export { connections, SocketEvent, SocketMessage };