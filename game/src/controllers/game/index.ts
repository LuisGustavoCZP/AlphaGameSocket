import { Console } from "console";
import { readFileSync } from "fs";
import { connections, Connection } from "../../connections";
import { IMatch, IPlayer, BaseMap, TileMap } from "../../models";
import { waitUntil } from "../../utils/wait";
import { Match } from "./match";
import { Player } from "./player";

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

    public createMatch (matchData : IMatch)
    {
        const match = new Match(matchData, this.generateMap());
        this.matchs.push(match);
        return match;
    }

    public async initPlayer (id : string, connection : Connection)
    {
        for (let match of this.matchs)
        {
            const p = match.players.find(player => player.equal(id));
            if(p) 
            {
                p.connection = connection;
                match.add(p);
                return true;
            }
        }
        return false;
    }

    /* public async addPlayer (connection : Connection)
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
        await match.add(player);
    } */
}

const gameManager = new GameManager();

export { gameManager, GameManager };