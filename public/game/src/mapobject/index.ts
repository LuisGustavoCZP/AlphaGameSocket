import { SpriteSheet } from "../spriteobject";
import { IMapData, IMapTileset, ITileSetData, ITileData } from "./models";

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

    constructor (data : IMapData)
    {
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
        
    }
}