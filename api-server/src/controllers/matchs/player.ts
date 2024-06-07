import { Connection, connectionManager } from "../../connections";
import { SocketEvent } from "../../connections/models";

export class Player 
{
    public index : number;
    private _id : string;
    private connection : Connection;
    private _matchID : string | null;
    public name: string;
    public character: number;

    constructor (connection : Connection)
    {
        this.index = -1;
        this._id = connection.userid;
        this._matchID = null;
        this.connection = connection;
        this.name = '';
        this.character = -1;
    }

    set matchIndex (index : number)
    {
        this.index = index;
    }

    set matchID (matchID)
    {
        this._matchID = matchID;
    }

    get matchID ()
    {
        return this._matchID;
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

    public off (type : string, callback? : SocketEvent)
    {
        if(this.connection) this.connection.off(type, callback);
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