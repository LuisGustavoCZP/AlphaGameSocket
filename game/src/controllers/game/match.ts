import { v4 as uuid } from "uuid";
import { SocketEvent } from "../../connections";
import { waitTime } from "../../utils/wait";
import { TileMap } from "../../models/map";
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
        await waitTime (5000);
        this.startedAt = new Date().toUTCString();
        this.send("starting-match", true);
    }

    async move ()
    {
        const player = this.players[this.turn];
        const move = Math.ceil(Math.random()*7);
        this.send("starting-move", {move:move});
        const speed = 0.1;

        for(let m = 0; m < move; m += speed)
        {
            await waitTime(100);
            this.send("update-move", {turn: this.turn, dist:m});
        }
        
        this.nextTurn ();
    }

    nextTurn ()
    {
        this.turn++;
        if(this.turn === this.players.length)
        {
            this.turn = 0;
            this.round++;
        }
        this.send("finish-move", {turn:this.turn, round:this.round});
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
                console.log("Mapa iniciado!")
                player.on("match-players", async (ready : boolean) => 
                {
                    if(ready)
                    {
                        player.send("match-round", this.round);
                        player.send("match-turn", this.turn);
                        if(this.players.every(player => player.connection))
                        {
                            if(this.startedAt != "") this.send("starting-match", true);
                        }
                    }
                });
                const ps = this.players.map((_player, index)=>
                {
                    const tile = this.map.base[_player.position];
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