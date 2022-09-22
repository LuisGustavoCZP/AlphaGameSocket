import redis from "../../clients/redis";
import { redisSocket } from "../../clients/redis/socket";
import { Connection, ConnectionStatus } from "../../connections";
import { IClosedMatch } from "../../models";
import { Match } from "./match";
import { Player } from "./player";

export class MatchController
{
    matchs : Map<string, Match>;
    players : Map<string, Player>;

    constructor ()
    {
        this.matchs = new Map<string, Match>();
        this.players = new Map<string, Player>();
        redisSocket.on("end-match", (match) => { this.closeMatch(match); });
    }

    async closeMatch (match : IClosedMatch)
    {
        
    }

    async getPlayingMatch (userid : string) 
    {
        const playerID = await redis.player.get(userid);
        if(!playerID) return null;
        
    }

    async setUserMatch (userid : string, matchid : string) 
    {
        const playerID = await redis.player.create(userid);
    }

    async getMatch (playerID : string)
    {
        /* let player;
        player = this.players.get(playerID)!;

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
        newMatch.add(player); */
    }

    async assignPlayer (playerID : string, matchID : string)
    {
        if(!this.matchs.has(matchID)) return;
        if(!this.players.has(playerID)) return;

        const match = this.matchs.get(matchID)!;
        const player = this.players.get(playerID)!;

        console.log("Adicionando partida", playerID, ">", matchID);

        match.send("match-enter", matchID);
        player.on("match-entered", () => 
        {
            match.add(player);
        });
    }

    async unassignPlayer (playerID : string)
    {
        
    }

    async newPlayer (connection : Connection)
    {
        if(this.players.has(connection.userid))
        {
            connection.close("O usuário já está em uso!", ConnectionStatus.Invalid);
            console.log("Player já está logado!", connection.userid);
        }
        
        console.log("Adicionando player", connection.userid);

        const player = new Player(connection);
        this.players.set(player.id, player);

        player.on("match-new", (data) => 
        {
            console.log("Player para partida", player.id);
            const newMatch = new Match();
            this.matchs.set(newMatch.id, newMatch);
            this.assignPlayer(player.id, newMatch.id);
        });

        player.on("match-enter", () => 
        {
            
        });
    }

    async removePlayer (playerID : string)
    {
        this.players.delete(playerID);
    }
}

const matchController = new MatchController();

export { matchController, Match, Player };