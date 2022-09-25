import postgres from "../clients/postgres";

interface PlayerScore
{
    id:string,
    score:number
}

interface PlayerRanking
{
    id:number,
    user_id:string,
    score:number
}

async function save (playerScores : PlayerScore[])
{
    const rankings = (await postgres.pool.query(`SELECT * FROM ranking`)).rows as PlayerRanking[];
    const rankScores = rankings.map(rank => {return {id:rank.user_id, score:rank.score}});
    playerScores.push(...rankScores);
    playerScores = playerScores.filter(playerScore => playerScore.id && playerScore.id != 'null');
    playerScores.sort((a, b) => b.score - a.score);
    const playersSet = new Set();
    playerScores = playerScores.filter(playerScore => 
    {
        if(playersSet.has(playerScore.id)) return false;
        playersSet.add(playerScore.id);
        return true;
    });

    if(playerScores.length > 5) playerScores.splice(5);
    else if(playerScores.length < 5)
    {
        for(let i = playerScores.length; i < 5; i++)
        {
            playerScores.push({id:'null', score:0});
        }
        /* playerScores = playerScores.fill(, playerScores.length-1, 5); */
    }

    const playerScoreCases = playerScores.map((playerScore, index) => 
    {
        return `WHEN id = ${index+1} THEN ${playerScore.score}`;
    }).join(' ');

    const playerIDCases = playerScores.map((playerScore, index) => 
    {
        const pid = playerScore.id && playerScore.id != 'null' ? `'${playerScore.id}'` : 'NULL';
        return `WHEN id = ${index+1} THEN ${pid}`;
    }).join(' ');

    const updateQuery = `UPDATE ranking SET score = (CASE ${playerScoreCases} END), user_id = (CASE ${playerIDCases} END), updated_at=now() WHERE id IN (1, 2, 3, 4, 5)`;

    //console.log(updateQuery);
    await postgres.pool.query(updateQuery);
}

async function load (userid : string)
{
    const rankings = (await postgres.pool.query(`SELECT * FROM ranking_view`)).rows as PlayerRanking[];
    return rankings;
}

export default {save, load};