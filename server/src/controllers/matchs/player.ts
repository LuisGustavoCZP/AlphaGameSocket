import { v4 as uuid } from "uuid";
import { connectionManager } from "../../connections";
import { SocketEvent } from "../../connections/models";

export class Player 
{
    index : number;
    #id : string;
    name: string;
    character: number;

    constructor (id : string)
    {
        this.index = -1;
        this.#id = id;
        this.name = '';
        this.character = -1;
    }

    set matchIndex (index : number)
    {
        this.index = index;
        this.name = `Jogador ${this.index+1}`;
        this.character = this.index;
    }

    public send (type : string, data : any)
    {
        const cn = connectionManager.list.get(this.#id);
        if(cn) cn.send(type, data);
    }

    public on (type : string, callback : SocketEvent)
    {
        const cn = connectionManager.list.get(this.#id);
        if(cn) cn.on(type, callback);
    }

    public onexit (callback : SocketEvent)
    {
        const cn = connectionManager.list.get(this.#id);
        if(cn) cn.onclose(callback);
    }
}