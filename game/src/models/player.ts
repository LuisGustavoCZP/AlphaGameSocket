import { connections, SocketEvent } from "../connections";

class Player 
{
    #id: string;
    name: string;
    character: number;
    position: number;
    points: number;

    constructor (id : string, name : string, character : number, position : number)
    {
        this.#id = id;
        this.name = name;
        this.character = character;
        this.position = position;
        this.points = 0;
    }

    send (type : string, data : any)
    {
        const cn = connections.list.get(this.#id);
        if(cn) cn.send(type, data);
    }

    on (type : string, callback : SocketEvent)
    {
        const cn = connections.list.get(this.#id);
        if(cn) cn.add(type, callback)
    }
}

export { Player };