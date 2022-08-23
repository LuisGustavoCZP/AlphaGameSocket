import { Server } from "../server";
import WebSocket from "ws";

export default class Connection 
{
    instance : WebSocket.Server<WebSocket>;
    constructor(server : Server)
    {
        this.instance = new WebSocket.Server({server:server.instance});
        this.instance.on('connection', socket => 
        {
            socket.send("ooooooooooi!");
        });
    }


}