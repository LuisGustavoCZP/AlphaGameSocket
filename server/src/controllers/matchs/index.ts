import { Connection } from "../../connections";
import { Match } from "./match";
import { Player } from "./player";

export class MatchController
{
    matchs : Match[];

    constructor ()
    {
        this.matchs = [];
    }

    async getMatch (connection : Connection)
    {
        const player = new Player(connection.id);

        if(this.matchs.length > 0)
        {
            const match = this.matchs.find(match => !match.isFull);
            if(match)
            {
                match.add(player);
                return;
            }
        }

        const newMatch = new Match();
        this.matchs.push(newMatch);
        newMatch.add(player);
    }
}

const matchController = new MatchController();

export { matchController, Match, Player };