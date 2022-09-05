import { Connection, connections, SocketEvent } from "../../connections";
import { IPlayer } from "../../models";

class Player 
{
    #id: string;
    #connection : Connection;
    name: string;
    character: number;
    position: number;
    points: number;

    constructor ({ id, name, character } : IPlayer)
    {
        this.#id = id;
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

    equal (id : string)
    {
        return this.#id == id
    }

    send (type : string, data : any)
    {
        const cn = connections.list.get(this.#id);
        if(cn) cn.send(type, data);
    }

    on (type : string, callback : SocketEvent)
    {
        const cn = connections.list.get(this.#id);
        if(cn) cn.on(type, callback)
    }
}

export { Player };