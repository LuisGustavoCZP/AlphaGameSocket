import { v4 as uuid } from "uuid";
import { connections } from "../connections";
import { TileMap } from "./map";
import {Player} from "./player";

class Match 
{
    id: string;
    players: Player[];
    startedAt: string;
    map: TileMap;
    round: number;
    turn: number;

    constructor (players : Player[], map : TileMap)
    {
        this.id = uuid();
        this.players = players;
        this.startedAt = new Date().toUTCString();
        this.map = map;
        this.round = 0;
        this.turn = 0;
    }

    send (type : string, data : any)
    {
        this.players.forEach(player => 
        {
            player.send(type, data);
        });
    }
}

export { Match };