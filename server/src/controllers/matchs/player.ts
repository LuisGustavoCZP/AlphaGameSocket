import { v4 as uuid } from "uuid";
import { Connection, connectionManager } from "../../connections";
import { SocketEvent } from "../../connections/models";

export class Player 
{
    public index : number;
    private _id : string;
    private connection : Connection;
    public name: string;
    public character: number;

    constructor (connection : Connection)
    {
        this.index = -1;
        this._id = connection.userid;
        this.connection = connection;
        this.name = '';
        this.character = -1;
    }

    set matchIndex (index : number)
    {
        this.index = index;
        this.name = `Jogador ${this.index+1}`;
        //this.character = this.index;
    }

    public get id ()
    {
        return this._id;
    }

    public send (type : string, data : any)
    {
        if(this.connection) this.connection.send(type, data);
    }

    public on (type : string, callback : SocketEvent)
    {
        if(this.connection) this.connection.on(type, callback);
    }

    public onexit (callback : SocketEvent)
    {
        if(this.connection) this.connection.onclose(callback);
    }

    public get data ()
    {
        return {index:this.index, id:this._id, name:this.name, character:this.character};
    }
}