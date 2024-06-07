import { v4 as uuid } from "uuid";
import { SocketEvent } from "../../connections";
import { waitBut, waitTime, waitUntil } from "../../utils/wait";
import { TileMap, TileEvent } from "./map";
import { Player } from "./player";
import { IMatch } from "../../models";
import { BaseMap } from "./basemap";
import { createEvent } from "../events";
import { redisSocket } from "../../clients/redis/socket";
import { gameSpeed } from "../../configs";
import { Chat } from "./chat";

class Match 
{
    id: string;
    players: Player[];
    createdAt: string;
    startedAt: string;
    endedAt: string;
    #map: TileMap;
    #round: number;
    #turn: number;
    #onend? : (match : Match) => void;
    #chat : Chat;

    static victoryPoints = 1200;
    static get deltaSpeed () { return 1/gameSpeed; }

    constructor (matchData : IMatch, baseMap : BaseMap)
    {
        //console.log(matchData);
        this.id = matchData.id;
        this.players = [];
        this.createdAt = new Date().toUTCString();
        this.startedAt = "";
        this.endedAt = "";
        this.#map = new TileMap(baseMap);
        this.#round = 0;
        this.#turn = 0;
        //this.start ();
        matchData.players.forEach((playerData, i) => 
        {
            this.players.push(new Player(i, playerData));
        });

        this.countdown ();

        this.#chat = new Chat(this.players);
    }

    set onend (event : (match : Match)=> void)
    {
        this.#onend = event;
    }

    async countdown ()
    {
        await waitBut(() => !(!this.startedAt), 30000, 500);
        this.start ();
    }

    async triggerEvent (player : Player, eventID : number, data? : any)
    {
        const event = createEvent(player, this, eventID, data)!;
        if(!(await event.check())) return false;
        
        await waitTime(500*Match.deltaSpeed);
        return await event.start();
    }

    async start ()
    {
        if(this.startedAt) return;
        this.startedAt = new Date().toUTCString();

        await waitTime (1000*Match.deltaSpeed);

        while(this.#round < 200 && !this.endedAt)
        {
            await this.playerTurn ();
        }

        await this.end();
    }

    async end ()
    {
        if(this.endedAt) return;
        this.endedAt = new Date().toUTCString();
        this.players = this.players.sort((a, b) => b.points - a.points);
        const winner = this.players[0];
        const pdata = this.players.map(player => ({username:player.name, score:player.points}));
        this.players.forEach((player, index) => 
        {
            const win = player.id == winner.id;
            player.send("match-result", {
                result: win,
                players: pdata
            });
        });

        await waitTime(5000*Match.deltaSpeed);

        if(this.#onend) this.#onend(this);
        redisSocket.on(`match-ended:${this.id}`, () => 
        {
            this.players.forEach(player => 
            {
                player.close();
            });
        });
        redisSocket.send("match-end", this);
    }

    async useItem (player : Player, itemID : number)
    {
        //const array = Array.from(this.players);
        //array.sort((a, b) => b.points - a.points);
        console.log("Usando item", itemID);

        let t = this.#turn + 1;
        let pwr = 1;
        if(t >= this.players.length) t=0;
        while(true)
        {
            if(await this.triggerEvent(this.players[t], -4, itemID))
            {
                pwr++;
                t++;
                if(t >= this.players.length) t=0;
                continue;
            }
            break;
        }

        const target = this.players[t];

        if(target.protection)
        {
            target.protection--;
            return;
        }

        if(itemID == 2) 
        {
            target.impeachment += pwr;
        }
        else if(itemID == 3) 
        {
            await this.playerMove(target, -5*pwr);
        }
    }

    async playerMove (player : Player, moveTiles : number)
    {
        const dir = moveTiles > 0? 1 : -1;
        for(let m = moveTiles; m != 0; m -= dir)
        {
            await waitTime(1000*Match.deltaSpeed);
            const tilepos = this.#map.base.tile(player.position.toString())!;
            
            const event = this.#map.tile(player.position.toString());

            if(!event || (event.eventID != 1 && event.eventID != 2))
            {
                if(player.position == 60)
                {
                    const playerDir = player.direction <= 2? 0 : 1;
                    //console.log(playerDir);
                    const nextTile = dir > 0 ? tilepos.next[playerDir] :  tilepos.back[playerDir];
                    player.position = nextTile;
                }
                else 
                {
                    const nextTile = dir > 0 ? tilepos.next[0] : tilepos.back[0];
                    player.position = nextTile;
                }
            }
            else 
            {
                if(dir > 0) 
                {
                    const result = await this.triggerEvent(player, event.eventID);
                    if(result)
                    {
                        const nextTile = tilepos.next[1];
                        player.points += 100;
                        player.position = nextTile;
                    }
                    else 
                    {
                        const nextTile = tilepos.next[0];
                        player.position = nextTile;
                    }
                }
                else if(dir < 0 && player.lastPostion == tilepos.next[1]) 
                {
                    player.points -= 100;
                    const nextTile = tilepos.back[0];
                    player.position = nextTile;
                }
            }

            const tilenext = this.#map.base.tile(player.position.toString())!;
            this.send("update-move", {playerindex: player.index, tile:tilenext.id, position:player.position});

            player.points += dir*10;
            if(player.points >= Match.victoryPoints) 
            {
                await this.end();
                return;
            }
        }
        this.send("player-points", {playerindex: player.index, points:player.points});
    }

    async playerTurn ()
    {
        const player = this.players[this.#turn];

        if(player.impeachment > 0)
        {
            player.impeachment--;
            await this.nextTurn (player);
            return;
        }

        let confirmed = false;
        player.on("confirm-turn", () => 
        {
            confirmed = true;
        });

        await this.triggerEvent(player, -1);

        await waitTime(500*Match.deltaSpeed);

        player.send("preparing-turn", true);

        await waitTime(1000*Match.deltaSpeed);
        const move = Math.ceil(Math.random()*6);

        player.send("starting-turn", { move:move });
        
        await waitTime(3000*Match.deltaSpeed);

        player.send("starting-move", true);

        await this.playerMove(player, move)
        
        const event = this.#map.tile(player.position.toString());
        if(event && (event.eventID != 1 && event.eventID != 2))
        { 
            const result = await this.triggerEvent(player, event.eventID);
            if(result)
            {
                //player.points += 100;
            }
        }

        await this.nextTurn (player);
    }

    async nextTurn (player : Player)
    {
        let nextRound = false;
        this.#turn++;
        if(this.#turn === this.players.length)
        {
            this.#turn = 0;
            this.#round++;
            nextRound = true;
        }

        player.send("finish-move", true);

        this.send("next-turn", { turn:this.#turn, round:this.#round });

        if(nextRound) await waitTime (2000*Match.deltaSpeed);
    }

    send (type : string, data : any)
    {
        this.players.forEach(player => 
        {
            player.send(type, data);
        });
    }

    on (type : string, callback : SocketEvent)
    {
        this.players.forEach(player => 
        {
            player.on(type, callback);
        });
    }
    
    off (type : string)
    {
        this.players.forEach(player => 
        {
            player.off(type);
        });
    }

    async add (player : Player)
    {
        player.send("match-ready", true);
        player.on("match-init", async (ready : boolean) => 
        {
            console.log("Partida iniciada!")
            player.on("match-map", async (ready : boolean) => 
            {
                console.log("Mapa iniciado!");
                player.on("match-players", async (ready : boolean) => 
                {
                    if(ready)
                    {
                        player.ready = true;
                        this.#chat.init(player);
                        let allready = true;

                        for(const p of this.players)
                        {
                            console.log(p.ready)
                            if(!p.ready) allready = false;
                        }

                        if(allready)
                        {
                            this.start ();
                            this.send("starting-match", true);
                            this.send("match-round", this.#round);
                            this.send("match-turn", this.#turn);
                        }
                    }
                });
                const ps = this.players.map((_player, index)=>
                {
                    const tile = this.#map.base.tile(_player.position.toString())!;
                    const p = {..._player, position:tile.id, isPlayer:_player.index === player.index};
                    delete (p as any)["id"];
                    return p;
                });
                player.send("match-players", ps);
                player.updateItems();
            });
            player.send("match-map", {mapSource:"/src/assets/maps/tilemaps/tabuleiro.tmj", eventsSource:"/src/assets/data/events.json", data:Array.from(this.#map.data.values())});
        });
    }
}

export { Match };