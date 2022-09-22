import { v4 as uuid } from "uuid";
import { redisSocket } from "../../clients/redis/socket";
import { SocketEvent } from "../../connections/models";
import { Player } from "./player";
/* import { matchController } from "./index"; */

export class Match 
{
    id: string;
    static maxSize = 4;
    players : Player[];
    count : number;
    full : boolean;
    private _ready : number;
    characters : number[];

    public constructor ()
    {
        this.id = uuid();
        this._ready = 0;
        this.count = 0;
        this.players = [];
        this.full = false;
        this.characters = new Array(6).fill(-1);
        for(let i = 0; i < Match.maxSize; i++)
        {
            this.players.push((null as unknown) as Player);
        }
    }

    randomUnselectedCharacters() 
    {
        const chars = this.characters.reduce((a, c, i) => 
        {
            if(c == -1) a.push(i);
            return a;
        }, [] as number[]);
        for(const player of this.players)
        {
            if(player.character >= 0) continue;
            const ci = Math.floor(Math.random()*chars.length);
            //console.log(`Random for ${player.index} is ${ci}`)         
            player.character = chars[ci];
            chars.splice(ci, 1);
        };    
    }

    public start ()
    {   
        this.randomUnselectedCharacters();
        const ps = this.players.map(player => player.data);
        redisSocket.send("new-match", {id:this.id, players:ps});
        this.send("match-start", true);
    }

    private nextCharacter (player : Player)
    {
        const lastChar = player.character;
        const checkNext = (init : number) =>
        {
            let char = init+1;
            while(this.characters[char] != -1)
            {
                char++;
                if(char >= this.characters.length) return -1;//char = 0;
            }
            return char;
        }

        if(lastChar == -1)
        {
            const char = checkNext(-1); 
            this.characters[char] = player.index;
            player.character = char;
        }
        else if(lastChar == this.characters.length-1)
        {
            this.characters[lastChar] = -1;
            player.character = -1;
        }
        else
        {
            this.characters[lastChar] = -1;
            const char = checkNext(lastChar); 
            this.characters[char] = player.index;
            player.character = char;
        }
        this.send("match-players", { players:this.players });
    }

    private lastCharacter (player : Player)
    {
        const lastChar = player.character;
        const checkLast = (init : number) =>
        {
            let char = init-1;
            while(this.characters[char] != -1)
            {
                char--;
                if(char < 0) return -1;//char = this.characters.length-1;
            }
            return char;
        }

        if(lastChar == -1)
        {
            const char = checkLast(this.characters.length); 
            this.characters[char] = player.index;
            player.character = char;
        }
        else if(lastChar == 0)
        {
            this.characters[lastChar] = -1;
            player.character = -1;
        }
        else 
        {
            this.characters[lastChar] = -1;
            const char = checkLast(lastChar); 
            this.characters[char] = player.index;
            player.character = char;
        }
        this.send("match-players", { players:this.players });
    }

    public isReady (playerID : number)
    {
        //if(this._ready == (this._ready | r)) ;
        return (this._ready & (1 << playerID)) > 0;
    }

    public ready (playerID : number)
    {
        if(!this.isReady(playerID))
        {
            this._ready += 1 << playerID;
            if(this.full) 
            {
                
                //console.log("Ready", this._ready, (1 << 4)-1)
                if(this._ready == (1 << 4)-1) this.start();
            }
        }
    }

    public unready (playerID : number)
    {
        if(this.isReady(playerID))
        {
            this._ready -= 1 << playerID;
        }
    }

    public add (player : Player)
    {
        const index = this.players.findIndex(player => !player);
        if(this.full || index === -1) return;
        player.matchIndex = index;
        player.matchID = this.id;
        this.players[index] = player;
        this.count ++;
        //console.log(player.index);

        player.send("match-init", { player:player.data });

        player.on("character-next", async () => 
        {
            this.nextCharacter(player);
        });

        player.on("character-last", async () => 
        {
            this.lastCharacter(player);
        });

        player.on("player-ready", async (isReady : boolean) => 
        {
            if(isReady) this.ready(player.index);
            else this.unready(player.index);

            this.send("match-ready", {ready:this._ready});
        });

        this.send("match-players", { players:this.players });
        player.send("match-ready", {ready:this._ready});

        if(this.count === this.players.length) 
        {
            this.full = true;
        }
    }

    public remove (player : Player)
    {
        player.matchID = null;
        this.unready(player.index);
        this.send("match-ready", {ready:this._ready});

        this.characters[player.character] = -1;
        this.count --;
        this.players[player.index] = null as any;
        this.send("match-players", { players:this.players });

        if(this.full) this.full = false;
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