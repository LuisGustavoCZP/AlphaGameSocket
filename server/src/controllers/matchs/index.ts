import redis from "../../clients/redis";
import postgres from "../../clients/postgres";
import { redisSocket } from "../../clients/redis/socket";
import { Connection, ConnectionStatus } from "../../connections";
import { SocketEvent } from "../../connections/models";
import { IClosedMatch, IUser, MatchData } from "../../models";
import { Match } from "./match";
import { Player } from "./player";

export class MatchController
{
    matchs : Map<string, Match>;
    players : Map<string, Player>;
    room : Map<string, Player>;
    playing : Set<string>;

    constructor ()
    {
        this.matchs = new Map<string, Match>();
        this.players = new Map<string, Player>();
        this.room = new Map<string, Player>();
        this.playing = new Set<string>();
        redisSocket.on("end-match", (match) => { this.closeMatch(match); });
    }

    get matchsData ()
    {
        const matchsData : MatchData[] = [];
        this.matchs.forEach(match => 
        {
            const data = {
                id:match.id,
                name:match.name,
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
        match.players.forEach(playerData => 
        {
            redis.auth.expiration(playerData.id, true);
            this.playing.delete(playerData.id);
            /* const player = this.players.get(playerData.id)!;
            this.initPlayer(player); */
        });
    }

    async startMatch (match : Match) 
    {
        console.log("Playing", match.players);
        match.players.forEach(player => 
        {
            this.playing.add(player.id);
        });
    }

    async initPlayer (player : Player)
    {
        this.room.set(player.id, player);

        const onEnter = async (matchID : string) => 
        {
            await this.assignPlayer(player, matchID);
            player.off("match-enter", onEnter);
            player.off("match-new", onNew);
        };

        const onNew = async () => 
        {
            console.log("Player para partida", player.id);
            const newMatch = new Match(`Partida ${this.matchs.size+1}`);
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
    }

    async getPlayingMatch (userid : string) 
    {
        const playerID = await redis.player.get(userid);
        if(!playerID) return null;
        
    }

    async assignPlayer (player : Player, matchID : string)
    {
        if(!this.matchs.has(matchID)) return false;
        const match = this.matchs.get(matchID)!;

        console.log("Jogador", player.id, "entrou na", matchID);

        player.send("match-enter", matchID);

        player.on("match-entered", () => 
        {
            player.on("match-exit", async () => 
            {
                player.send("match-exit", true);
                await this.unassignPlayer(player);
            });
            match.add(player);
            redis.auth.expiration(player.id, false);
            this.room.delete(player.id);
            match.onstart = (match) => this.startMatch(match);
            this.send("matchs", this.matchsData);
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
        
        console.log("Jogador", player.id, "saiu da", matchID)
        this.send("matchs", this.matchsData);

        await this.initPlayer(player);
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
        
        if(this.playing.has(connection.userid))
        {
            connection.send("match-start", true);
            return true;
        }

        //console.log("Adicionando player", connection.userid);

        const player = new Player(connection);
        const user = (await postgres.select<Partial<IUser>>("users", {id:connection.userid}, ["username"]))[0];
        player.name = user.username!;
        this.players.set(player.id, player);
        await this.initPlayer(player);
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