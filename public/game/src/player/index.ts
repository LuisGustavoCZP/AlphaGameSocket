import { connection } from "../connection";
import { ICharacterData } from "../gameobject";
import { IPlayerData } from './models';

class Player 
{
    index: number;
    name: string;
    character: string;
    position: number;
    points: number;

    constructor (index : number, name : string, character : string, position : number, points : number)
    {
        this.index = index;
        this.name = name;
        this.character = character;
        this.position = position;
        this.points = points;
    }

    send (type : string, data : any)
    {
        connection.send(type, data);
    }
}

export { Player, IPlayerData }