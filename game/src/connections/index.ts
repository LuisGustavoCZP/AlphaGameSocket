import { Server } from "../server";
import { v4 as uuid } from "uuid";
import WebSocket from "ws";
import { SocketEvent, SocketMessage } from "./models";

export class Connection 
{
    id : string;
    socket : WebSocket;
    events : Map<string, SocketEvent>

    constructor (socket : WebSocket)
    {
        this.id = uuid();
        this.socket = socket;
        this.events = new Map<string, SocketEvent>();
        this.send("connected", this.id);
        socket.on("message", (resp : string) => this.message(resp));
        this.add("moveTo", (data) => 
        {
            console.log("Movendo para", data);
            this.send("movedTo", data);
        });
    }

    send (type : string, data : any)
    {
        const msg = {
            type,
            data,
            date:Date.now()
        }
        console.log(type, data)
        this.socket.send(JSON.stringify(msg));
    }

    message (resp : string)
    {
        const msg = JSON.parse(resp) as SocketMessage;
        //console.log(this.events);
        if(!this.events.has(msg.type)) return;
        const event = this.events.get(msg.type)!;
        event(msg.data);
    }

    add (type : string, event : SocketEvent)
    {
        this.events.set(type, event);
    }

    remove (type : string)
    {
        if(this.events.has(type)) 
        {
            return this.events.delete(type);
        }
        return false;
    }
}

export class Connections
{
    instance : WebSocket.Server<WebSocket>;
    connections : Map<string, Connection>;

    constructor(server : Server)
    {
        this.connections = new Map<string, Connection>();
        this.instance = new WebSocket.Server({server:server.instance});
        this.instance.on('connection', (socket : WebSocket)  => 
        {
            const connection = new Connection(socket);
            this.connections.set(connection.id, connection);
        });
    }
}
