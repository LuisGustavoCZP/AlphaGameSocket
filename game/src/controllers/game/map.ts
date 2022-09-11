import { BaseTile, BaseMap } from "./basemap";

class TileBlock
{

}

class TileMap 
{
    base : BaseMap;
    data : Map<string, TileBlock>;
    constructor (base : BaseMap)
    {
        this.base = base;
        this.data = new Map<string, TileBlock>();
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
        for (let side = 0; side < 4; side++)
        {
            for(let i = 0; i < 3; i++)
            {
                const sideTiles = this.base.side(side);
                const r = Math.floor(Math.random()*sideTiles.length);
                const p = sideTiles[r].toString();

                do
                {
                    this.data.set(p, 
                    {
                        id:0
                    });
                } while (this.data.has(p))
            }
        }
    }
}

export { TileMap };