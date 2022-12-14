export type ILoot = ILootChance[];

export interface ILootChance 
{
    rate:number,
    id:number,
    quanty:number
}

class Loot
{
    chances : ILootChance[];
    rateMax : number;

    constructor (chances : ILootChance[])
    {
        this.chances = chances;
        this.rateMax = chances.reduce((p, chance) => p+chance.rate, 0);
    }
}

export enum ItemTarget 
{
    None = "none",
    Self = "self",
    Other = "other"
}

export interface IItemData
{
    id:number,
    name:string,
    usable:boolean,
    target:ItemTarget
}

export class Item 
{
    public id : number;
    public quanty : number;

    static loots : Loot[];
    static datas : IItemData[];

    public static setLoots (lootsData : ILoot[])
    {
        this.loots = lootsData.map(loot => new Loot(loot));
    }

    constructor (id:number, quanty:number)
    {
        this.id = id;
        this.quanty = quanty;
    }

    static loot (id : number)
    {
        const loot = this.loots[id];
        
        let ri = 0;
        const r = Math.random()*loot.rateMax;

        for(const chance of loot.chances)
        {
            const cr = ri + chance.rate;
            //console.log(r, cr, ri);
            if(ri < r && cr >= r)
            {
                return new Item(chance.id, chance.quanty);
            }
            ri += chance.rate;
        }
    }
}