import { ISpriteSheetData } from "./models";

const listSpriteSheets = new Map<string, SpriteSheet>();

export class SpriteRect
{
    public x : number;
    public y : number;
    public width : number;
    public height : number;

    public constructor (x : number, y : number, width : number, height : number)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export class SpriteSheet
{
    public name : string;
    public image : HTMLImageElement;
    public readyDraw : boolean;
    public spriteSource : string;
    public tileheight: number;
    public tilewidth: number;
    public tilespacing: number;
    public tilemargin: number;
    public rows : number;
    public columns : number;
    public data : SpriteRect[]; 

    static getByName (spriteSheetName : string)
    {
        if(listSpriteSheets.has(spriteSheetName)) 
            return listSpriteSheets.get(spriteSheetName)!;
        return null;
    }

    static async addSpriteSheet (spriteSheet : SpriteSheet)
    {
        listSpriteSheets.set(spriteSheet.name, spriteSheet);
    }

    static async load (source : string) : Promise<SpriteSheet>
    {
        const ssd = this.getByName(source);
        if(ssd) return ssd;
        const data = await fetch(source).then(resp => resp.json()).catch(err => console.log(err));
        return this.create(data);
    }

    static async create (spriteSheetData : ISpriteSheetData) : Promise<SpriteSheet>
    {
        const image = await this.loadSpriteImage (spriteSheetData.image);
        //console.log(image);
        const spriteSheet = new SpriteSheet(spriteSheetData, image);
        this.addSpriteSheet(spriteSheet);
        return spriteSheet;
    }

    static async loadSpriteImage (spriteSource : string)
    {
        const image = new Image();
        await new Promise <void> ((resolve, reject) => 
        {
            image.onload = () => { resolve(); };
            image.src = spriteSource;
        });

        return image;
    }

    protected constructor (spriteSheetData : ISpriteSheetData, image : HTMLImageElement)
    {
        this.name = spriteSheetData.name;
        this.readyDraw = false;
        this.spriteSource = image.src;
        this.rows = 0;
        this.columns = 0;
        this.image = image;
        this.data = [];
        this.tileheight = spriteSheetData.tileheight;
        this.tilewidth = spriteSheetData.tilewidth;
        this.tilespacing = spriteSheetData.spacing;
        this.tilemargin = spriteSheetData.margin;

        const fs = spriteSheetData.spacing;
        const nw = spriteSheetData.tilewidth + fs, nh = spriteSheetData.tileheight + fs;
        this.rows = Math.ceil((this.image.width + fs) / (nw));
        this.columns = Math.ceil((this.image.height + fs) / (nh));
        //console.log(`${this.image.width} => [${this.rows}, ${this.columns}]`);
        for (let j = 0; j < this.columns; j++)
        {
            for (let i = 0; i < this.rows; i++)
            {
                this.data.push(new SpriteRect(nw*i, nh*j, this.tilewidth, this.tileheight));
            }
        }

        this.readyDraw = true;
    }

    get hashKey ()
    {
        return `${this.tilewidth}:${this.tileheight}:${this.tilespacing}:${this.tilemargin}:${this.rows}:${this.columns}`;
    }
}

export { ISpriteSheetData };