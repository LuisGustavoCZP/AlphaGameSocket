import { v4 as uuid } from "uuid";
import { redisSocket } from "../../clients/redis/socket";
import { SocketEvent } from "../../connections/models";
import { Player } from "./player";

export class Match 
{
    id: string;
    static maxSize = 4;
    players : Player[];
    isFull : boolean;
    characters : number[];

    public constructor ()
    {
        this.id = uuid();
        this.players = [];
        this.isFull = false;
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

    public add (player : Player)
    {
        const index = this.players.findIndex(player => !player);
        if(this.isFull || index === -1) return;
        player.matchIndex = index;
        this.players[index] = player;
        console.log(player.index);

        player.send("match-init", { player:player.data });

        player.on("character-next", async () => 
        {
            this.nextCharacter(player);
        });

        player.on("character-last", async () => 
        {
            this.lastCharacter(player);
        });

        this.send("match-players", { players:this.players });

        player.onexit(() => 
        {
            this.remove(player);
        });

        if(index === Match.maxSize-1) 
        {
            this.isFull = true;
            this.start();
        }
    }

    public remove (player : Player)
    {
        this.characters[player.character] = -1;
        this.players[player.index] = null as any;
        this.send("match-players", { players:this.players });
        if(this.isFull) this.isFull = false;
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