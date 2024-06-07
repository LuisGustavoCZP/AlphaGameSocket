import { BaseTile, BaseMap } from "./basemap";

class TileEvent
{
    id:string;
    eventID: number;

    constructor (id: string, eventID : number)
    {
        this.id = id;
        this.eventID = eventID;
    }
}

class TileMap 
{
    base : BaseMap;
    data : Map<string, TileEvent>;
    constructor (base : BaseMap)
    {
        this.base = base;
        this.data = new Map<string, TileEvent>();
        this.build();
    }

    basetile (key : string)
    {
        return this.base.tile(key)!;
    }

    tile (key : string)
    {
        return this.data.get(key)!;
    }

    build () 
    {
        this.data.set('55', new TileEvent('55', 1));
        this.data.set('5', new TileEvent('5', 2));
        //this.data.set('115', new TileBlock('115', 2));
        //this.data.set('65', new TileBlock('65', 3));

        for (let side = 0; side < 4; side++)
        {
            const sideTiles = this.base.side(side);
            const t = Math.floor(Math.random()*3)+3;
            for(let i = 0; i < t;)
            {
                let r = Math.floor(Math.random()*sideTiles.length);
                let p = sideTiles[r].toString();
                if(this.data.has(p)) continue;
                
                this.data.set(p, new TileEvent(p, 0));
                i++;
            }
        }

        for (let side = 0; side < 2; side++)
        {
            const sideTiles = this.base.side(side+4);
            for(let i = 0; i < sideTiles.length; i++)
            {
                let p = sideTiles[i].toString();
                if(this.data.has(p)) continue;
                if(i % 2 == 0)
                {
                    this.data.set(p, new TileEvent(p, 3));
                }
            }
        }

        console.log("Buildou mapa");
    }
}

export { TileMap, TileEvent };