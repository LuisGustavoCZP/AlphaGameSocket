import { v4 as uuid } from "uuid";
import { SocketEvent } from "../../connections";
import { waitTime } from "../../utils/wait";
import { TileMap } from "./map";
import { Player } from "./player";
import { IMatch } from "../../models";
import { BaseMap } from "./basemap";

class Match 
{
    id: string;
    players: Player[];
    createdAt: string;
    startedAt: string;
    map: TileMap;
    round: number;
    turn: number;
    static speed = 1;

    constructor (matchData : IMatch, baseMap : BaseMap)
    {
        //console.log(matchData);
        this.id = matchData.id;
        this.players = [];
        this.createdAt = new Date().toUTCString();
        this.startedAt = "";
        this.map = new TileMap(baseMap);
        this.round = 0;
        this.turn = 0;
        //this.start ();
        matchData.players.forEach((playerData, i) => 
        {
            this.players.push(new Player(i, playerData));
        });
    }

    async triggerEvent (tileID : string)
    {
        console.log("Acionando evento!", tileID)
        return false;
    }

    async start ()
    {
        if(this.startedAt) return;
        this.startedAt = new Date().toUTCString();
        this.send("starting-match", true);
        this.send("match-round", this.round);
        this.send("match-turn", this.turn);

        await waitTime (5000*(1/Match.speed));

        while(this.round < 40)
        {
            await this.move ();
        }
        
    }

    async move ()
    {
        const player = this.players[this.turn];
        this.send("preparing-move", true);
        await waitTime(1000*(1/Match.speed));
        const move = Math.ceil(Math.random()*6);
        player.points += move*10;
        //const direction = Math.random() > 0.5;
        this.send("starting-move", {playerindex: this.turn, move:move});
        //const speed = 0.1;

        for(let m = 0; m < move; m += 1)
        {
            await waitTime(1000*(1/Match.speed));
            const tilepos = this.map.base.tile(player.position.toString())!;
            
            const event = this.map.tile(player.position.toString());

            if(!event || (event.eventID != 1 && event.eventID != 2))
            {
                const nextTile = tilepos.next[0];
                player.position = nextTile;
            }
            else 
            {
                const result = await this.triggerEvent(event.id);
                if(result)
                {
                    const nextTile = tilepos.next[1];
                    player.position = nextTile;
                }
                else 
                {
                    const nextTile = tilepos.next[0];
                    player.position = nextTile;
                }
            }

            const tilenext = this.map.base.tile(player.position.toString())!;
            this.send("update-move", {playerindex: this.turn, tile:tilenext.id, position:player.position});
        }
        
        await this.nextTurn (player);
    }

    async nextTurn (player : Player)
    {
        let nextRound = false;
        this.turn++;
        if(this.turn === this.players.length)
        {
            this.turn = 0;
            this.round++;
            nextRound = true;
        }

        const event = this.map.tile(player.position.toString());
        if(event)
        { 
            const result = await this.triggerEvent(event.id);
        }

        this.send("finish-move", {turn:this.turn, round:this.round, points:player.points, items:[]});
        if(nextRound) await waitTime (2000*(1/Match.speed));
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

                        let allready = true;
                        for(const p of this.players)
                        {
                            console.log(p.ready)
                            if(!p.ready) allready = false;
                        }

                        if(allready)
                        {
                            this.start ();
                        }
                    }
                });
                const ps = this.players.map((_player, index)=>
                {
                    const tile = this.map.base.tile(_player.position.toString())!;
                    const p = {..._player, position:tile.id, isPlayer:_player.index === player.index};
                    return p;
                });
                player.send("match-players", ps);
            });
            player.send("match-map", {mapSource:"./src/assets/maps/tilemaps/tabuleiro.tmj", eventsSource:"./src/assets/data/events.json", data:Array.from(this.map.data.values())});
        });
    }
}

export { Match };