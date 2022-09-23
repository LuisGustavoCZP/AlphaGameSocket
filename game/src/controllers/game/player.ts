import { Connection, connections, SocketEvent } from "../../connections";
import { IPlayer } from "../../models";
import { Item } from "./item";

class Player 
{
    id: string;
    #connection : Connection;
    #ready : boolean;
    index : number;
    name: string;
    character: number;
    #position: number;
    points: number;
    #items : Map<number, Item>;

    constructor (index : number, { id, name, character } : IPlayer)
    {
        this.#ready = false;
        this.id = id;
        this.index = index;
        this.name = name;
        this.character = character;
        this.#position = 110;
        this.points = 0;
        this.#connection = null as any;
        this.#items = new Map<number, Item>();
    }

    get data ()
    {
        return Object.assign({id:this.id}, this);
    }

    set position (position : number)
    {
        this.#position = position;
    }

    get position ()
    {
        return this.#position;
    }

    set connection (connection : Connection) 
    {
        this.#connection = connection;
    }

    get ready ()
    {
        return this.#ready;
    }

    set ready (isReady)
    {
        this.#ready = isReady;
    }

    hasItem (itemID : number, quanty = 1)
    {
        return this.getItem(itemID) >= quanty;
    }

    getItem (itemID : number)
    {
        if(this.#items.has(itemID)) return 0;
        return this.#items.get(itemID)!.quanty;
    }

    addItem (newitem : Item)
    {
        if(this.#items.has(newitem.id))
        {
            const item = this.#items.get(newitem.id)!;
            item.quanty += newitem.id;
        }
        else this.#items.set(newitem.id, newitem);
        
        this.send("player-items", {items:Array.from(this.#items.values())});
        return true;
    }

    removeItem (newitem : Item)
    {
        if(this.#items.has(newitem.id))
        {
            const item = this.#items.get(newitem.id)!;
            item.quanty -= newitem.quanty;
            if(item.quanty <= 0)
            {
                this.#items.delete(newitem.id)
            }

            this.send("player-items", {items:Array.from(this.#items.values())});
            return true;
        }
        return false;
    }

    equal (id : string)
    {
        return this.id == id
    }

    send (type : string, data : any)
    {
        if(this.#connection) this.#connection.send(type, data);
    }

    on (type : string, callback : SocketEvent)
    {
        if(this.#connection) this.#connection.on(type, callback)
    }

    off (type : string)
    {
        if(this.#connection) this.#connection.off(type)
    }

    close ()
    {
        if(this.#connection) this.#connection.close();
    }
}

export { Player };