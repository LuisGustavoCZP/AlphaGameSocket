import { GameObject } from "../gameobject";
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
        const image = await this.loadSpriteImage (spriteSheetData.image.replace("../", "/src/assets/maps/"));
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

    public constructor (x : number, y : number, properties : ITilePropertyData[] = [])
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

export interface ITileEvent 
{
     id:string, 
     eventID: number
}

export class MapTile 
{
    public id : string;
    public x : number;
    public y : number;
    public layers : number[];

    public constructor (id: string, x : number, y : number, layers : number[])
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.layers = layers;
    }
}

export class MapObject
{
    public static context : CanvasRenderingContext2D;
    public eventsObjects : GameObject[];
    public tilesets : TileSetObject[];
    public tileheight : number;
    public tilewidth : number;
    public layers : IMapLayer[];
    public tiles : MapTile[];
    public events : Map<string, ITileEvent>;

    constructor (data : IMapData, eventsObjects : GameObject[])
    {
        this.layers = data.layers;
        this.tileheight = data.properties.find(p => p.name == "renderHeight")?.value!;
        this.tilewidth = data.properties.find(p => p.name == "renderWidth")?.value!;
        this.events = new Map<string, ITileEvent>;
        this.tilesets = [];
        this.tiles = [];
        this.eventsObjects = eventsObjects;
        this.load(data);
    }

    public async load (data : IMapData)
    {
        for (const {source} of data.tilesets)
        {
            const tileset = await TileSetObject.load(`${source.replace("..", "src/assets/maps")}`);
            this.tilesets.push(tileset);
      
            let t = 0;
            for (let j = 0; j < data.height; j++)
            {
                const py = (j*this.tileheight);
                for (let i = 0; i < data.width; i++)
                {
                    const px = (i*this.tilewidth);
                    const id = t.toString();
                    const k = t++;
                    const layers = data.layers.map(layer => layer.data[k]-1);
                    const tile = new MapTile(id, px, py, layers);
                    this.tiles.push(tile);
                }
            }
        }
    }

    public updateEvents (events : ITileEvent[]) 
    {
        events.forEach(event => this.events.set(event.id, event));
        console.log("Eventos", events);
    }

    public draw ()
    {
        if(this.tilesets.length == 0) return;
        const context = MapObject.context;

        const tilesheet = this.tilesets[0];
        this.tiles.forEach (tile => 
        {
            tile.layers.forEach((layer, index) => 
            {
                if(layer >= 0) 
                {
                    const tsTile = tilesheet.data[layer];
                    context.drawImage(tilesheet.image!, tsTile.x, tsTile.y, tsTile.width, tsTile.height, tile.x, tile.y, this.tilewidth, this.tileheight);
                }
            });

            const event = this.events.get(tile.id);
            if(event) 
            {
                const eventObj = this.eventsObjects[event.eventID];
                eventObj.sprite.draw(context, tile.x, tile.y, this.tilewidth);
            }
        });
    }
}