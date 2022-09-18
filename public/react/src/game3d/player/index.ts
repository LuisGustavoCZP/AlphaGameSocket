import { Connection } from "../../connection";
import { ICharacterData } from "../character";
import { IPlayerData } from './models';

class Player 
{
    #connection : Connection;
    index: number;
    name: string;
    character: string;
    position: number;
    points: number;

    constructor (connection : Connection ,index : number, name : string, character : string, position : number, points : number)
    {
        this.#connection = connection;
        this.index = index;
        this.name = name;
        this.character = character;
        this.position = position;
        this.points = points;
    }

    send (type : string, data : any)
    {
        this.#connection.send(type, data);
    }
}

export type { IPlayerData }
export { Player }