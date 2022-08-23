import { Server } from "../server";
import WebSocket from "ws";
import { SocketEvent, SocketMessage } from "./models";

export class Connection
{
    instance : WebSocket.Server<WebSocket>;
    events : Map<string, SocketEvent[]>;

    constructor(server : Server)
    {
        this.instance = new WebSocket.Server({server:server.instance});
        this.events = new Map<string, SocketEvent[]>();
        this.instance.on('connection', socket => 
        {
            socket.on("message", (resp : string) => this.message(resp));
            this.add("moveTo", (data) => 
            {
                console.log("Movendo para", data);
            });
        });
    }

    send (type : string, data : any)
    {
        const msg = {
            type,
            data,
            date:Date.now()
        }
        this.instance.emit(JSON.stringify(msg));
    }

    message (resp : string)
    {
        const msg = JSON.parse(resp) as SocketMessage;
        console.log(this.events);
        if(!this.events.has(msg.type)) return;
        const eventArray = this.events.get(msg.type)!;
        eventArray.forEach(event => 
        {
            event(msg.data);
        });
    }

    add (type : string, event : SocketEvent)
    {
        if(this.events.has(type)) 
        {
            this.events.get(type)?.push(event);
            return;
        }
        const es = [event];
        this.events.set(type, es);
    }

    remove (type : string, event : SocketEvent)
    {
        if(this.events.has(type)) 
        {
            const es = this.events.get(type)!;
            const i = es.findIndex(e => e==event);
            es.splice(i, 1);
            return;
        }
    }
}
