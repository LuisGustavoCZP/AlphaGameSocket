import postgres from "../clients/postgres";
import { IClosedMatch } from "../models";
import historyService from "./history";
import rankingService from "./ranking";

async function save (match : IClosedMatch)
{
    const {players} = match;
    await historyService.save(match);
    
    const playerCases = players.map((player) => 
    {
        return `WHEN id = '${player.id}' THEN (SELECT SUM(${player.points} + users.score) FROM users WHERE id = '${player.id}')`;
    }).join(' ');

    const playerIDs = players.map(player => `'${player.id}'`).join(',');
    
    const query = `UPDATE users SET score = (CASE ${playerCases} END), updated_at=now() WHERE id IN (${playerIDs}) Returning id, score`;
    console.log(query)
    const scoresResp = (await postgres.pool.query(query)).rows;
    console.log("Salvando scores", scoresResp);

    await rankingService.save(scoresResp);
}
export default {save};