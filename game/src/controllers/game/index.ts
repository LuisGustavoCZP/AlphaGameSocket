import { Console } from "console";
import { connections, Connection } from "../../connections";
import { IMatch, IPlayer } from "../../models";
import { TileMap } from "./map";
import { waitUntil } from "../../utils/wait";
import { Match } from "./match";
import { Player } from "./player";
import { BaseTile, BaseMap } from "./basemap";

class GameManager 
{
    baseMap : BaseMap;
    matchs : Match[];

    constructor ()
    {
        this.matchs = [];
        this.baseMap = BaseMap.load("./src/data/test1.json");
    }

    public createMatch (matchData : IMatch)
    {
        const match = new Match(matchData, this.baseMap);
        this.matchs.push(match);
        return match;
    }

    public async initPlayer (id : string, connection : Connection)
    {
        //console.log("Rodando aqui", this.matchs)
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
}

const gameManager = new GameManager();

export { gameManager, GameManager };