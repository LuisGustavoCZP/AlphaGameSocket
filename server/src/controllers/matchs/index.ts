import redis from "../../clients/redis";
import { redisSocket } from "../../clients/redis/socket";
import { Connection, ConnectionStatus } from "../../connections";
import { SocketEvent } from "../../connections/models";
import { IClosedMatch, MatchData } from "../../models";
import { Match } from "./match";
import { Player } from "./player";

export class MatchController
{
    matchs : Map<string, Match>;
    players : Map<string, Player>;
    room : Map<string, Player>;
    playing : Map<string, Player>;

    constructor ()
    {
        this.matchs = new Map<string, Match>();
        this.players = new Map<string, Player>();
        this.room = new Map<string, Player>();
        this.playing = new Map<string, Player>();
        redisSocket.on("end-match", (match) => { this.closeMatch(match); });
    }

    get matchsData ()
    {
        const matchsData : MatchData[] = [];
        this.matchs.forEach(match => 
        {
            const data = {
                id:match.id,
                count:match.count,
                max:match.players.length,
                full:match.full
            }
            matchsData.push(data);
        });
        return matchsData;
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

    async assignPlayer (player : Player, matchID : string)
    {
        if(!this.matchs.has(matchID)) return false;
        const match = this.matchs.get(matchID)!;

        console.log("Adicionando partida", player.id, ">", matchID);

        player.send("match-enter", matchID);

        player.on("match-entered", () => 
        {
            player.on("match-exit", async () => 
            {
                await this.unassignPlayer(player);
            });
            match.add(player);
            this.room.delete(player.id);
        });

        return true;
    }

    async unassignPlayer (player : Player)
    {
        const matchID = player.matchID;

        if(!matchID || !this.matchs.has(matchID)) return false;
        const match = this.matchs.get(matchID)!;

        player.off("match-exit");
        player.off("match-entered");
        match.remove(player);
        if(match.count == 0)
        {
            this.matchs.delete(matchID);
        }
        
        console.log("Jogador saiu!")

        this.room.set(player.id, player);
        this.send("matchs", this.matchsData);
        return true;
    }

    async newPlayer (connection : Connection)
    {
        if(this.players.has(connection.userid))
        {
            connection.close("O usuário já está em uso!", ConnectionStatus.Invalid);
            console.log("Player já está logado!", connection.userid);
            return false;
        }
        
        console.log("Adicionando player", connection.userid);

        const player = new Player(connection);
        this.players.set(player.id, player);
        this.room.set(player.id, player);

        const onEnter = async (matchID : string) => 
        {
            await this.assignPlayer(player, matchID);
            player.off("match-enter", onEnter);
            player.off("match-new", onNew);
            this.send("matchs", this.matchsData);
        };

        const onNew = async () => 
        {
            console.log("Player para partida", player.id);
            const newMatch = new Match();
            this.matchs.set(newMatch.id, newMatch);
            await onEnter(newMatch.id);
        };

        player.onexit(async () => 
        {
            await this.removePlayer(player);
        });

        player.on("match-enter", onEnter);
        player.on("match-new", onNew);

        player.send("matchs", this.matchsData);
        return true;
    }

    async removePlayer (player : Player)
    {
        await this.unassignPlayer(player);
        this.room.delete(player.id);
        this.players.delete(player.id);
    }

    public send (type : string, data : any, filter? : (player : Player) => boolean)
    {
        for (const player of this.room.values())
        {
            if(player && (filter?filter(player):true))
            {
                player.send(type, data);
            }   
        }
    }

    public on (type : string, callback : SocketEvent, filter? : (player : Player) => boolean)
    {
        for (const player of this.room.values())
        {
            if(player && (filter?filter(player):true))
            {
                player.on(type, callback);
            }   
        }
    }
}

const matchController = new MatchController();

export { matchController, Match, Player };