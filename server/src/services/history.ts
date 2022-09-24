import postgres from "../clients/postgres";
import { IClosedMatch } from "../models";

async function save (match : IClosedMatch)
{
    const winner = match.players[0].id;
    console.log(match.players);
    const matchData = {
        id:match.id,
        winner,
        started_at: match.startedAt,
        finished_at: match.endedAt,
    };
    await postgres.insert("matchs", matchData);

    for(const matchPlayer of match.players)
    {
        const matchUserData = {
            match_id:match.id,
            user_id:matchPlayer.id,
            score:matchPlayer.points,
            state:'',
            character:matchPlayer.character,
        };
        await postgres.insert("match_users", matchUserData);
    };
}

async function load (userid : string)
{
    const hisotyMatchs = postgres.select("history_view", {user_id:userid});
    return hisotyMatchs;
}

export default {save, load};