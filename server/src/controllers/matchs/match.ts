import { SocketEvent } from "../../connections/models";
import { Player } from "./player";

export class Match 
{
    static maxSize = 4;
    players : Player[];
    isFull : boolean;

    public constructor ()
    {
        this.players = [];
        this.isFull = false;
        for(let i = 0; i < Match.maxSize; i++)
        {
            this.players.push((null as unknown) as Player);
        }
    }

    public add (player : Player)
    {
        const index = this.players.findIndex(player => !player);
        if(this.isFull || index === -1) return;
        if(index === Match.maxSize-1) this.isFull = true;
        player.matchIndex = index;
        this.players[index] = player;
        console.log(player.index);
        player.send("match-init", { player:player });
        this.send("match-update", { players:this.players });
        player.onexit(() => {this.remove(player)});
    }

    public remove (player : Player)
    {
        this.players[player.index] = null as any;
        this.send("match-update", { players:this.players });
    }

    public send (type : string, data : any, filter? : (player : Player) => boolean)
    {
        for (const player of this.players)
        {
            if(player && (filter?filter(player):true))
            {
                player.send(type, data);
            }   
        }
    }

    public on (type : string, callback : SocketEvent, filter? : (player : Player) => boolean)
    {
        for (const player of this.players)
        {
            if(player && (filter?filter(player):true))
            {
                player.on(type, callback);
            }   
        }
    }
}