import { Console } from "console";
import { readFileSync } from "fs";
import { connections, Connection } from "../../connections";
import { Match, Player, BaseMap, TileMap } from "../../models";

class GameManager 
{
    baseMap : BaseMap;
    matchs : Match[];

    constructor ()
    {
        this.matchs = [];
        this.baseMap = JSON.parse(readFileSync("./src/data/test1.json").toString()) as BaseMap;
        //console.log(this.baseMap);
    }

    public generateMap ()
    {
        const map = new TileMap(this.baseMap);
        return map;
    }

    public createMatch ()
    {
        const match = new Match([], this.generateMap());
        this.matchs.push(match);
        return match;
    }

    public addPlayer (connection : Connection)
    {
        let match : Match;
        console.log(this.matchs);
        if(this.matchs.length === 0) match = this.createMatch();
        else {
            match = this.matchs[this.matchs.length-1];
            if(match.players.length === 4) match = this.createMatch();
        }

        const p = match.players.length;
        const player = new Player(connection.id, `Player ${p + 1}`, p, 30);
        match.players.push(player);

        connection.add("match-init", (ready : boolean) => 
        {
            console.log("Partida iniciada!")
            connection.add("match-map", (ready : boolean) => 
            {
                console.log("Mapa iniciado!")
                connection.add("match-players", (ready : boolean) => 
                {
                    if(ready)
                    {
                        connection.send("match-round", match.round);
                        connection.send("match-turn", match.turn);
                    }
                });
                const ps = match.players.map((player)=>
                {
                    const tile = match.map.base[player.position];
                    const p = {...player, position:tile.id};//Object.assign({}, player);
                    return p;
                });
                connection.send("match-players", ps);
            });
            connection.send("match-map", match.map.data);
        });
    }
}

const gameManager = new GameManager();

export { gameManager, GameManager };