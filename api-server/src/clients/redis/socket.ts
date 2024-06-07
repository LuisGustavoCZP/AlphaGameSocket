import Redis from "ioredis";
import { RedisEvent } from "./models";
import { redis } from "../../configs";

class RedisSocket 
{
    pubSocket : Redis;
    subSocket : Redis;
    events : Map<string, RedisEvent[]>;

    constructor ()
    {
        this.pubSocket = new Redis(redis);
        this.subSocket = new Redis(redis);
        this.events = new Map<string, RedisEvent[]>();
        this.subSocket.on("message", (channel, message) => this.receive(channel, message));
    }

    public send (channel : string, data : any)
    {
        this.pubSocket.publish(channel, JSON.stringify(data));
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
            this.subSocket.subscribe(channel, (err, count) => {
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