import { SocketEvent, SocketMessage } from "./models";
export { SocketEvent, SocketMessage };

export class Connection
{
    instance : WebSocket;
    events : Map<string, SocketEvent>;

    constructor (url : string)
    {
        console.log(url);
        this.events = new Map<string, SocketEvent>();
        this.instance = new WebSocket(`wss://${url}`, ["https", "http"]);
        this.instance.onmessage = (resp) => this.message(resp);
        this.instance.onopen = () => 
        {
            console.log("Conectado!");
            this.send("player-init", location.hash.replace('#', ''));
        }
        this.instance.onclose = () => {
            console.log("Desconectado!");
        }
    }
    
    send (type : string, data : any)
    {
        const msg = {
            type,
            data,
            date:Date.now()
        }
        console.log("Sending", msg);
        this.instance.send(JSON.stringify(msg));
    }

    message (resp : MessageEvent)
    {
        const msg = JSON.parse(resp.data) as SocketMessage;
        console.log("Receiving", msg);
        if(!this.events.has(msg.type)) return;
        const event = this.events.get(msg.type)!;
        if(event) event(msg.data);
    }

    add (type : string, event : SocketEvent)
    {
        if(this.events.has(type)) 
        {
            return;
        }
        this.events.set(type, event);
    }

    remove (type : string)
    {
        if(this.events.has(type)) 
        {
            this.events.delete(type);
            return;
        }
    }
}

const connection = new Connection(window.location.host.replace("8000", "5000"));
export { connection };