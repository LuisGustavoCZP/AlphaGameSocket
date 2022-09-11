import { v4 as uuid } from "uuid";
import { SocketEvent } from "../../connections";
import { waitTime } from "../../utils/wait";
import { TileMap } from "./map";
import { Player } from "./player";
import { IMatch } from "../../models";

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

    constructor (matchData : IMatch, map : TileMap)
    {
        //console.log(matchData);
        this.id = matchData.id;
        this.players = [];
        this.createdAt = new Date().toUTCString();
        this.startedAt = "";
        this.map = map;
        this.round = 0;
        this.turn = 0;
        //this.start ();
        matchData.players.forEach((playerData, i) => 
        {
            this.players.push(new Player(i, playerData));
        });
    }

    async start ()
    {
        if(this.startedAt) return;
        this.startedAt = new Date().toUTCString();
        this.send("starting-match", true);
        this.send("match-round", this.round);
        this.send("match-turn", this.turn);

        await waitTime (5000);

        while(this.round < 40)
        {
            await this.move ();
        }
        
    }

    async move ()
    {
        const player = this.players[this.turn];
        this.send("preparing-move", true);
        await waitTime(5000*Match.speed);
        const move = Math.ceil(Math.random()*6);
        player.points += move*10;
        //const direction = Math.random() > 0.5;
        this.send("starting-move", {playerindex: this.turn, move:move});
        //const speed = 0.1;

        for(let m = 0; m < move; m += 1)
        {
            await waitTime(1000*Match.speed);
            const tilepos = this.map.base.tile(player.position.toString())!;
            player.position = tilepos.next[Math.floor(Math.random()*tilepos.next.length)];
            const tilenext = this.map.base.tile(player.position.toString())!;
            this.send("update-move", {playerindex: this.turn, tile:tilenext.id, position:player.position});
            //this.send("update-move", {turn: this.turn, dist:m});
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

        const tile = this.map.tile(player.position.toString())!;
        tile
        this.send("finish-move", {turn:this.turn, round:this.round, points:player.points, items:[]});
        if(nextRound) await waitTime (2000*Match.speed);
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
        /* this.players.push(player); */
        //console.log("add player", player);
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
                    const p = {..._player, position:tile.id, isPlayer:_player.index === player.index};//Object.assign({}, player);
                    return p;
                });
                player.send("match-players", ps);
            });
            player.send("match-map", this.map.data);
        });
    }
}

export { Match };