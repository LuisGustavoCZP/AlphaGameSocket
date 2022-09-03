import { v4 as uuid } from "uuid";
import { connectionManager } from "../../connections";
import { SocketEvent } from "../../connections/models";

export class Player 
{
    index : number;
    #id : string;

    constructor (id : string)
    {
        this.index = -1;
        this.#id = id;
    }

    public send (type : string, data : any)
    {
        const cn = connectionManager.connections.get(this.#id);
        if(cn) cn.send(type, data);
    }

    public on (type : string, callback : SocketEvent)
    {
        const cn = connectionManager.connections.get(this.#id);
        if(cn) cn.add(type, callback);
    }
}