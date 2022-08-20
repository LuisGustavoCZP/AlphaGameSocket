import { IAnimationSetsData, IFrameData, ISpriteSheetData, ISpriteData } from "./models";
import { ISpriteAnimatedData } from "./models/spritedata";

const listSpriteSheets = new Map<string, SpriteSheet>();
const listSpriteRects = new Map<string, SpriteRect>();
const listAnimationSetsData = new Map<string, IAnimationSetsData>();
const listAnimationSets = new Map<string, AnimationSet>();

export async function loadSpriteSheets (spriteSheetsData : ISpriteSheetData[]) 
{
    for(const spriteSheetData of spriteSheetsData) 
    {
        await SpriteSheet.getSpriteSheet(spriteSheetData);
    };
    return;
}

export async function loadAnimationSets (animationSets : IAnimationSetsData[])
{
    for(const animationData of animationSets) 
    {
        await loadAnimationSet(animationData);
    };

    return;
}

export async function loadAnimationSet (animationSetData : IAnimationSetsData)
{
    if(listAnimationSetsData.has(animationSetData.name)) return;
    listAnimationSetsData.set(animationSetData.name, animationSetData);
}

export class SpriteSheet
{
    public readyDraw : boolean;
    public spriteFrame : IFrameData;
    public spriteSource : string;
    public rows : number;
    public columns : number;
    public image : HTMLImageElement;

    static async getSpriteSheet (spriteSheetData : ISpriteSheetData) : Promise<SpriteSheet>
    {
        if(listSpriteSheets.has(spriteSheetData.name)) 
            return listSpriteSheets.get(spriteSheetData.name)!;

        const image = await SpriteSheet.loadSpriteImage (spriteSheetData.src);
        const spriteSheet = new SpriteSheet(spriteSheetData.frame, image);
        listSpriteSheets.set(spriteSheetData.name, spriteSheet);

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

    constructor (spriteFrame : IFrameData, image : HTMLImageElement)
    {
        this.readyDraw = false;
        this.spriteFrame = spriteFrame;  
        this.spriteSource = image.src;
        this.rows = 0;
        this.columns = 0;
        this.image = image;

        const fs = this.spriteFrame.space;
        const nw = this.spriteFrame.width + fs, nh = this.spriteFrame.height + fs;
        this.rows = Math.ceil((this.image.width + fs) / (nw));
        this.columns = Math.ceil((this.image.height + fs) / (nh));
        console.log(`${this.image.width} => [${this.rows}, ${this.columns}]`);
        this.readyDraw = true;
    }

    get hashKey ()
    {
        return `${this.spriteFrame.width}:${this.spriteFrame.height}:${this.spriteFrame.space}:${this.rows}:${this.columns}`;
    }
}

export class SpriteRect
{
    public x : number;
    public y : number;
    public width : number;
    public height : number;

    private constructor (x : number, y : number, width : number, height : number)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public static create (spriteWidth : number, spriteHeight : number, spriteSpace : number, rows : number, columns : number, index : number)
    {
        const spriteRectKey = `${spriteWidth}:${spriteHeight}:${spriteSpace}:${rows}:${columns}:${index}`;
        if(listSpriteRects.has(spriteRectKey))
            return listSpriteRects.get(spriteRectKey)!;

        const x = index % rows;
        const y = (index - x) / rows;//(anim ? rows : columns);

        const fx = ((spriteWidth + spriteSpace) * x);
        const fy = ((spriteHeight + spriteSpace) * y);

        const spriteRect = new SpriteRect(fx, fy, spriteWidth, spriteHeight);
        listSpriteRects.set(spriteRectKey, spriteRect);

        return spriteRect;
    }
}

export class GameSprite
{
    protected spriteSheet : SpriteSheet;
    protected spriteRect : SpriteRect;
    public index : number;
    
    constructor ({spriteSheet, spriteIndex} : ISpriteData)
    {
        this.index = spriteIndex;
        this.spriteSheet = listSpriteSheets.get(spriteSheet)!;
        this.spriteRect = this.getRect();
    }

    public set spriteIndex (i : number)
    {
        this.index = i;
        this.spriteRect = this.getRect();
    }

    public get spriteIndex ()
    {
        return this.index;
    }

    public getRect ()
    {
        return SpriteRect.create(this.spriteSheet.spriteFrame.width, this.spriteSheet.spriteFrame.height, this.spriteSheet.spriteFrame.space, this.spriteSheet.rows, this.spriteSheet.columns, this.index);
    }

    public draw(context : CanvasRenderingContext2D, positionX : number, positionY : number, size : number, rotation : number = 0) 
    {
        if(!this.spriteSheet) return;

        //console.log(rotation);
        const cx = positionX + (context.canvas.width/2), cy = positionY + (context.canvas.height/2);
        if(rotation != 0)
        {
            context.translate(cx, cy);
            context.rotate((Math.PI / 180) * rotation);     
            context.translate(-cx, -cy);
            
            this.drawImage(context, cx, cy, size);
            

            context.translate(cx, cy);
            context.rotate((Math.PI / 180) * -rotation);
            context.translate(-cx, -cy);
        }
        else 
        {
            this.drawImage(context, cx, cy, size);
        }
        
    }

    private drawImage(context : CanvasRenderingContext2D, positionX : number, positionY : number, size : number)
    {
        positionX = positionX - (size/2);
        positionY = positionY - (size/2);

        //context.fillStyle = "red";
        //context.fillRect(positionX, positionY, size, size);

        context.drawImage(
            this.spriteSheet.image!,
            this.spriteRect.x,
            this.spriteRect.y,
            this.spriteRect.width,
            this.spriteRect.height,
            positionX, 
            positionY,
            size,
            size
        );
    }
    
    static create (spriteData : ISpriteData)
    {
        
        if((spriteData as any).animationSet)
        {
            return new AnimatedSprite(spriteData as ISpriteAnimatedData);
        }
        else
        {
            console.log(spriteData);
            return new GameSprite(spriteData);
        }
    }
}

export type AnimationSet = Map<string, SpriteRect[]>;

export class AnimatedSprite extends GameSprite
{
    protected frame : number;
    protected frameTime : number;
    public animationName : string;
    protected animations : AnimationSet

    constructor (spriteData : ISpriteAnimatedData)
    {
        super(spriteData);
        this.frame = 0;
        this.frameTime = 0;
        this.animationName = "idle down";
        this.animations = this.getAnimations(spriteData.spriteIndex, listAnimationSetsData.get(spriteData.animationSet!)!);
    }

    public getAnimations (spriteIndex : number, animationSetData : IAnimationSetsData)
    {
        
        const spriteRectKey = `${this.spriteSheet.hashKey}:${this.index}`;
        const key = `${animationSetData.name}:${spriteRectKey}`
        if(listAnimationSets.has(key)) 
            return listAnimationSets.get(key)!;

        const animSeq : AnimationSet = new Map<string, SpriteRect[]> ();
        const sframe = this.spriteSheet.spriteFrame;

        animationSetData.sequences.forEach(animation => 
        {
            const {sequence, name} = animation;
            const seqRects = sequence.map(frame => 
            {
                const frameIndex = spriteIndex + frame[0] + (frame[1]*this.spriteSheet.rows);
                return SpriteRect.create(sframe.width, sframe.height, sframe.space, this.spriteSheet.rows, this.spriteSheet.columns, frameIndex);
            });
            
            animSeq.set(name, seqRects);
        });

        listAnimationSets.set(key, animSeq);
        return animSeq;
    }

    public draw(context : CanvasRenderingContext2D, posX : number, posY : number, size : number, rotation : number = 0) 
    {
        let sequence : SpriteRect[] | null = null;
        if(this.animationName)
        {
            sequence = this.animations.get(this.animationName)!;
            this.frameTime++;
            if(this.frameTime > 10) 
            {
                this.frameTime = 0;
                this.frame += 1;
            }
            if(this.frame >= sequence.length) this.frame = 0;
        }
        if(!sequence)
        {
            this.frame = 0;
            sequence = this.animations.get("idle down")!;
        }

        this.spriteRect = sequence[this.frame];

        super.draw(context, posX, posY, size, rotation);
    }
    
}