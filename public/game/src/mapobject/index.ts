import { SpriteSheet } from "../spriteobject";
import { IMapData, IMapTileset, ITileSetData, ITileData, IMapLayer } from "./models";

export class TileSetObject extends SpriteSheet
{
    public tiles: ITileData[];

    static async load (source : string) : Promise<TileSetObject>
    {
        const ssd = this.getByName(source) as TileSetObject;
        if(ssd) return ssd;
        const data = await fetch(source).then(resp => resp.json());
        return this.create(data);
    }

    static async create (spriteSheetData : ITileSetData) : Promise<TileSetObject>
    {
        const image = await this.loadSpriteImage (spriteSheetData.image);
        const spriteSheet = new TileSetObject(spriteSheetData, image);
        this.addSpriteSheet(spriteSheet);
        return spriteSheet;
    }

    constructor (tilesetData : ITileSetData, image : HTMLImageElement)
    {
        super(tilesetData, image);
        this.tiles = tilesetData.tiles;
    }
}

export class MapObject
{
    public static context : CanvasRenderingContext2D;
    public tilesets : TileSetObject[];
    /* public orientation : string;
    public renderorder : string; */
    public tileheight : number;
    public tilewidth : number;
    /* public columns : number;
    public rows : number; */
    public layers : IMapLayer[];

    constructor (data : IMapData)
    {
        this.layers = data.layers;
        this.tileheight = data.tileheight;
        this.tilewidth = data.tilewidth;
        this.tilesets = [];
        this.load(data.tilesets);
    }

    public async load (tilesetDatas : IMapTileset[])
    {
        for (const {source} of tilesetDatas)
        {
            const tileset = await TileSetObject.load(source);
            this.tilesets.push(tileset);
        }
    }

    public draw ()
    {
        if(this.tilesets.length == 0) return;
        const context = MapObject.context;
        const cx = context.canvas.width/2, cy = context.canvas.height/2;
        for (const layer of this.layers)
        {
            let t = 0;
            for (let i = 0; i < layer.width; i++)
            {
                for (let j = 0; j < layer.height; j++)
                {
                    const tilesheet = this.tilesets[0];
                    const tile = tilesheet.data[layer.data[t++]];
                    context.drawImage(tilesheet.image!, tile.x, tile.y, tile.width, tile.height, cx, cy, this.tilewidth, this.tileheight);
                }
            }
        }
    }
}