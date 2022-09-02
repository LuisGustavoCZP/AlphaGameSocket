import { BaseTile, BaseMap } from "./basemap";

class TileMap 
{
    base : BaseMap;
    data : any;
    constructor (base : BaseMap)
    {
        this.base = base;
        this.data = null;
    }
}

export { TileMap };