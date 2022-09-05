import { Connection, connections, SocketEvent } from "../../connections";
import { IPlayer } from "../../models";

class Player 
{
    #id: string;
    #connection : Connection;
    #ready : boolean;
    index : number;
    name: string;
    character: number;
    position: number;
    points: number;

    constructor (index : number, { id, name, character } : IPlayer)
    {
        this.#ready = false;
        this.#id = id;
        this.index = index;
        this.name = name;
        this.character = character;
        this.position = 30;
        this.points = 0;
        this.#connection = null as any;
    }

    set connection (_connection : Connection) 
    {
        this.#connection = _connection;
    }

    get ready ()
    {
        return this.#ready;
    }

    set ready (isReady)
    {
        this.#ready = isReady;
    }

    equal (id : string)
    {
        return this.#id == id
    }

    send (type : string, data : any)
    {
        this.#connection.send(type, data);
    }

    on (type : string, callback : SocketEvent)
    {
        this.#connection.on(type, callback)
    }
}

export { Player };