import { Console } from "console";
import { connections, Connection } from "../../connections";
import { IMatch, IPlayer } from "../../models";
import { TileMap } from "./map";
import { waitUntil } from "../../utils/wait";
import { Match } from "./match";
import { Player } from "./player";
import { BaseTile, BaseMap } from "./basemap";
import { redisSocket } from "../../clients/redis/socket";
import { IQuestion } from "./questions";
import { ILoot, Item } from "./item";
import { loadSync } from "../../utils/loader";

class GameManager 
{
    baseMap : BaseMap;
    matchs : Map<string, Match>;
    questions : IQuestion[]

    constructor ()
    {
        this.matchs = new Map<string, Match>();
        this.baseMap = BaseMap.load("./src/data/map/test1.json");
        this.questions = loadSync<IQuestion[]>("./src/data/questions/questions.json");
        Item.setLoots(loadSync<ILoot[]>("./src/data/items/loots.json"));

        redisSocket.on("new-match", (match) =>
        {
            this.createMatch(match);
        });
    }

    public createMatch (matchData : IMatch)
    {
        const match = new Match(matchData, this.baseMap);
        match.onend = () => {this.destroyMatch(match.id)};
        this.matchs.set(match.id, match);
        return match;
    }

    public destroyMatch (matchID : string)
    {
        this.matchs.delete(matchID);
    }

    public async initPlayer (id : string, connection : Connection)
    {
        //console.log("Rodando aqui", this.matchs)
        for (let match of this.matchs.values())
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