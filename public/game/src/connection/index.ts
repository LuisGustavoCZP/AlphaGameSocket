import { SocketEvent, SocketMessage } from "./models";
export { SocketEvent, SocketMessage };

export class Connection
{
    instance : WebSocket;
    events : Map<string, SocketEvent[]>;

    constructor (url : string)
    {
        //console.log();
        this.events = new Map<string, SocketEvent[]>();
        this.add("connected", (data)=>
        {
            console.log(data);
        });
        this.instance = new WebSocket(`wss://${url}`, ["https", "http"]);
        this.instance.onmessage = (resp) => this.message(resp);
        this.add("movedTo", (data)=>
        {
            console.log("Moved to", data);
        });
    }
    
    send (type : string, data : any)
    {
        const msg = {
            type,
            data,
            date:Date.now()
        }
        this.instance.send(JSON.stringify(msg));
    }

    message (resp : MessageEvent)
    {
        const msg = JSON.parse(resp.data) as SocketMessage;
        console.log(msg);
        if(this.events.has(msg.type)) return;
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

const connection = new Connection(window.location.host.replace("8000", "5000")); //window.location.host
export { connection };