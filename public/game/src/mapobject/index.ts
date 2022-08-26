import { playerController } from "../playercontroller";
import { SpriteSheet } from "../spriteobject";
import { IMapData, IMapTileset, ITileSetData, ITileData, IMapLayer, ITilePropertyData } from "./models";

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

export class TileObject 
{
    public properties : ITilePropertyData[];
    public x : number;
    public y : number;

    public constructor (x : number, y : number, properties : ITilePropertyData[])
    {
        this.x = x;
        this.y = y;
        this.properties = properties;
    }
    public get id ()
    {
        return `${this.x},${this.y}`;
    }
}

export type ITileMap = Map<string, TileObject>;

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
    public tiles : ITileMap;

    constructor (data : IMapData)
    {
        this.layers = data.layers;
        this.tileheight = data.tileheight;
        this.tilewidth = data.tilewidth;
        this.tilesets = [];
        this.tiles = new Map<string, TileObject>;
        this.load(data.tilesets);
    }

    public async load (tilesetDatas : IMapTileset[])
    {
        for (const {source} of tilesetDatas)
        {
            const tileset = await TileSetObject.load(source);
            this.tilesets.push(tileset);
            tileset.tiles.forEach(tileData => 
            {
                this.layers.forEach(layer => 
                {
                    let t = 0;
                    for (let j = 0; j < layer.height; j++)
                    {
                        const py = (j*this.tileheight);
                        for (let i = 0; i < layer.width; i++)
                        {
                            const px = (i*this.tilewidth);
                            const tileIndex = layer.data[t++]-1;
                            if(tileIndex < 0) continue;
                            if(tileIndex == tileData.id)
                            {
                                const tile = new TileObject(px, py, tileData.properties);
                                this.tiles.set(tile.id, tile);
                            }
                        }
                    }
                });
            });
        }
    }

    public draw ()
    {
        if(this.tilesets.length == 0) return;
        const context = MapObject.context;
        const playerX = playerController.targetX;
        const playerY = playerController.targetY;
        const cx = Math.round((-0.5+(playerX + (context.canvas.width/2))/this.tilewidth))*this.tilewidth, cy = Math.round(-0.5+((playerY + (context.canvas.height/2))/this.tileheight))*this.tileheight;
        //console.log(cx, cy);

        for (const layer of this.layers)
        {
            const tilesheet = this.tilesets[0];
            let t = 0;
            for (let j = 0; j < layer.height; j++)
            {
                const py = (j*this.tileheight);
                for (let i = 0; i < layer.width; i++)
                {
                    const px = (i*this.tilewidth);
                    const tileIndex = layer.data[t++]-1;
                    if(tileIndex < 0) continue;
                    const tile = tilesheet.data[tileIndex];
                    context.drawImage(tilesheet.image!, tile.x, tile.y, tile.width, tile.height, px, py, this.tilewidth, this.tileheight);

                    const tilekey = `${px},${py}`;
                    
                    if(cx == px && cy == py && this.tiles.has(tilekey))
                    {
                        const tileData = this.tiles.get(tilekey)!;
                        context.fillStyle = "rgba(0,120,255,0.1)";
                        context.fillRect(tileData.x, tileData.y, this.tilewidth, this.tileheight);
                    }
                }
            }
        }
    }
}