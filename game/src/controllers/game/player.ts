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
    #lastPostion : number;
    points: number;
    #items : Map<number, Item>;
    protection : number;
    impeachment : number;

    constructor (index : number, { id, name, character } : IPlayer)
    {
        this.#ready = false;
        this.id = id;
        this.index = index;
        this.name = name;
        this.character = character;
        this.#lastPostion = 111;
        this.#position = 110;
        this.points = 0;
        this.#connection = null as any;
        this.#items = new Map<number, Item>();
        this.protection = 0;
        this.impeachment = 0;
    }

    get data ()
    {
        return Object.assign({id:this.id}, this);
    }

    get direction ()
    {
        const dir = this.#position - this.#lastPostion;
        const vertical = dir % 11 == 0;
        
        return vertical? (dir > 0? 1 : 2) : (dir > 0? 3 : 4);
    }

    set position (position : number)
    {
        this.#lastPostion = this.#position;
        this.#position = position;
    }

    get position ()
    {
        return this.#position;
    }

    get lastPostion ()
    {
        return this.#lastPostion;
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
        if(!this.#items.has(itemID)) return 0;
        return this.#items.get(itemID)!.quanty;
    }

    addItem (newitem : Item)
    {
        if(this.#items.has(newitem.id))
        {
            const item = this.#items.get(newitem.id)!;
            item.quanty += newitem.quanty;
        }
        else this.#items.set(newitem.id, newitem);
        
        this.updateItems();
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

    usableItems ()
    {
        const usables : Item[] = [];
        this.#items.forEach(item => 
        {
            const itemData = Item.datas[item.id];
            if(itemData.usable) usables.push(item);
        });
        return usables;
    }

    reflectionItems (itemID : number)
    {
        const usables : Item[] = [];
        this.#items.forEach(item => 
        {
            if(item.id == itemID || item.id == 1) usables.push(item);
        });
        return usables;
    }

    updateItems ()
    {
        this.send("player-items", {items:Array.from(this.#items.values())});
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