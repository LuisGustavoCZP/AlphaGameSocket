import { SocketEvent, SocketMessage } from "./models";

const defaultUrl = "localhost:8000";

export class Connection
{
    instance : WebSocket;
    events : Map<string, SocketEvent[]>;

    constructor (url : string = defaultUrl)
    {
        this.events = new Map<string, SocketEvent[]>();
        this.instance = new WebSocket(`wss://${url}`, ["https", "http"]);
        this.instance.onmessage = (resp) => this.message(resp);
        this.instance.onopen = () => {this.#onEventOpen();};
        this.instance.onclose = () => {this.#onEventClose();};
    }
    
    #onEventOpen () 
    {
        console.log("Conectado!");
        const type = "onopen";
        if(!this.events.has(type)) return;
        const events = this.events.get(type)!;
        if(events) 
        {
            events.forEach(event =>
            {
                event();
            });
        }
    }

    #onEventClose () 
    {
        console.log("Desconectado!");
        const type = "onclose";
        if(!this.events.has(type)) return;
        const events = this.events.get(type)!;
        if(events) 
        {
            events.forEach(event =>
            {
                event();
            });
        }
    }

    send (type : string, data : any)
    {
        const msg = {
            type,
            data,
            date:Date.now()
        }
        //console.log("Sending", msg);
        this.instance.send(JSON.stringify(msg));
    }

    message (resp : MessageEvent)
    {
        const msg = JSON.parse(resp.data) as SocketMessage;
        //console.log("Receiving", msg);
        if(!this.events.has(msg.type)) return;
        const events = this.events.get(msg.type)!;
        if(events) 
        {
            events.forEach(event =>
            {
                event(msg.data);
            });
        }
    }

    on (type : string, event : SocketEvent)
    {
        if(this.events.has(type)) 
        {
            this.events.get(type)?.push(event);
            return;
        }
        this.events.set(type, [event]);
    }

    off (type : string)
    {
        if(this.events.has(type)) 
        {
            this.events.delete(type);
            return;
        }
    }
}

/* const connection = new Connection(window.location.host.replace("8000", "5000"));
export { connection }; */