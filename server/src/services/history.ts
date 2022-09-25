import postgres from "../clients/postgres";
import { IClosedMatch } from "../models";

async function save (match : IClosedMatch)
{
    const winner = match.players[0].id;
    //console.log(match.players);
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
    const historyMatchs = await postgres.select("history_view", {user_id:userid}, ["match_id", "started_at", "finished_at", "created_at"]) as any[];//
    const matchs_query = historyMatchs.map(historyMatch => `'${historyMatch.match_id}'`).join(", ");
    //console.log("MATCH", matchs_query);
    if(historyMatchs.length == 0) return historyMatchs;
    const users = (await postgres.pool.query(`SELECT * FROM history_player_view WHERE match_id IN (${matchs_query})`)).rows;
    const history = historyMatchs.map(historyMatch => 
    {
        return Object.assign(
        {
            users:users.filter(user => user.match_id == historyMatch.match_id).map(user => 
            {
                delete user.created_at;
                delete user.match_id;
                return user;    
            })
        }, historyMatch);
    });

    return history;
}

export default {save, load};