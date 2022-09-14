import Redis from "ioredis";
import { RedisEvent } from "./models";

class RedisSocket 
{
    socket : Redis; 
    /* subServers : Map<string, Redis>; */
    events : Map<string, RedisEvent[]>;

    constructor ()
    {
        /* this.pubServer = new Redis(); */
        this.socket = new Redis();//new Map<string, Redis>();
        this.events = new Map<string, RedisEvent[]>();
        this.socket.on("message", (channel, message) => this.receive(channel, message));
    }

    public send (channel : string, data : any)
    {
        this.socket.publish(channel, JSON.stringify(data));
    }

    public on (channel : string, event : (data : any) => void)
    {
        if(this.events.has(channel))
        {
            this.events.get(channel)!.push(event);
        }
        else 
        {
            this.events.set(channel, [event]);
            this.socket.subscribe(channel, (err, count) => {
                if (err) console.error(err.message);
                console.log(`Subscribed to ${count} channels.`);
            });
        }
    }

    private receive (channel : string, message : any)
    {
        const data = JSON.parse(message);
        console.log(`Received message from ${channel} channel.`);
        console.log(data);

        if(this.events.has(channel))
        {
            const events = this.events.get(channel)!;
            events.forEach(event => 
            {
                event(data)
            });
        }
    }
}

const redisSocket = new RedisSocket();

export { redisSocket };