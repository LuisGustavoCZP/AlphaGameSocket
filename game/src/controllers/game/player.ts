import { Connection, connections, SocketEvent } from "../../connections";
import { IPlayer } from "../../models";
import { Item } from "./item";

class Player 
{
    private _id: string;
    private _connection : Connection;
    private _ready : boolean;
    index : number;
    name: string;
    character: number;
    private _position: number;
    points: number;
    private items : Map<number, Item>;

    constructor (index : number, { id, name, character } : IPlayer)
    {
        this._ready = false;
        this._id = id;
        this.index = index;
        this.name = name;
        this.character = character;
        this._position = 110;
        this.points = 0;
        this._connection = null as any;
        this.items = new Map<number, Item>();
    }

    set position (_position : number)
    {
        this._position = _position;
    }

    get position ()
    {
        return this._position;
    }

    set connection (_connection : Connection) 
    {
        this._connection = _connection;
    }

    get ready ()
    {
        return this._ready;
    }

    set ready (isReady)
    {
        this._ready = isReady;
    }

    hasItem (itemID : number, quanty = 1)
    {
        return this.getItem(itemID) >= quanty;
    }

    getItem (itemID : number)
    {
        if(this.items.has(itemID)) return 0;
        return this.items.get(itemID)!.quanty;
    }

    addItem (newitem : Item)
    {
        if(this.items.has(newitem.id))
        {
            const item = this.items.get(newitem.id)!;
            item.quanty += newitem.id;
        }
        else this.items.set(newitem.id, newitem);
        
        this.send("player-items", {items:Array.from(this.items.values())});
        return true;
    }

    removeItem (newitem : Item)
    {
        if(this.items.has(newitem.id))
        {
            const item = this.items.get(newitem.id)!;
            item.quanty -= newitem.quanty;
            if(item.quanty <= 0)
            {
                this.items.delete(newitem.id)
            }

            this.send("player-items", {items:Array.from(this.items.values())});
            return true;
        }
        return false;
    }

    equal (id : string)
    {
        return this._id == id
    }

    send (type : string, data : any)
    {
        this._connection.send(type, data);
    }

    on (type : string, callback : SocketEvent)
    {
        this._connection.on(type, callback)
    }

    off (type : string)
    {
        this._connection.off(type)
    }
}

export { Player };