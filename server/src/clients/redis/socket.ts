import Redis from "ioredis";
import { RedisEvent } from "./models";

class RedisSocket 
{
    pubServer : Redis;
    subServer : Redis; 
    /* subServers : Map<string, Redis>; */
    events : Map<string, RedisEvent[]>;

    constructor ()
    {
        this.pubServer = new Redis();
        this.subServer = new Redis();//new Map<string, Redis>();
        this.events = new Map<string, RedisEvent[]>();
        this.subServer.on("message", (channel, message) => this.receive(channel, message));
    }

    public send (channel : string, data : any)
    {
        this.pubServer.publish(channel, JSON.stringify(data));
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
            this.subServer.subscribe(channel, (err, count) => {
                if (err) console.error(err.message);
                console.log(`Subscribed to ${count} channels.`);
            });
        }

        
        /* if(!this.subServers.has(channel))
        {
            const subServer = new Redis();
            subServer.subscribe(channel, (err, count) => {
                if (err) console.error(err.message);
                console.log(`Subscribed to ${count} channels.`);
            });
            this.subServers.set(channel, subServer);
        } */
    }

    private receive (channel : string, message : any)
    {
        console.log(`Received message from ${channel} channel.`);
        console.log(JSON.parse(message));
    }
}

const redisSocket = new RedisSocket();

export { redisSocket };