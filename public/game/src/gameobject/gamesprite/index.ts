import { SpriteSheet, SpriteRect } from "../../spriteobject";
import { IAnimationSetsData, ISpriteData, ISpriteAnimatedData } from "./models";

const listAnimationSetsData = new Map<string, IAnimationSetsData>();
const listAnimationSets = new Map<string, AnimationSet>();

export async function loadAnimationSets (sources : string[])
{
    for(const source of sources) 
    {
        await loadAnimationSet(source);
    };

    return;
}
export async function loadAnimationSet (source : string)
{
    if(listAnimationSetsData.has(source)) return listAnimationSetsData.get(source)!;
    const data = await fetch(`${source}`).then(resp => resp.json()) as IAnimationSetsData;
    listAnimationSetsData.set(source, data);
    return data;
}

export class AnimationSet
{
    public name : string;
    private map : Map<string, SpriteRect[]>;
    constructor (spriteSheet : SpriteSheet, animationSetData : IAnimationSetsData, spriteIndex : number)
    {
        this.map = new Map<string, SpriteRect[]>();
        this.name = `${spriteSheet.name}:${animationSetData.name}:${spriteIndex}`
        if(listAnimationSets.has(this.name)) 
            return listAnimationSets.get(this.name)!;

        //const animSeq : AnimationSet = new Map<string, SpriteRect[]> ();

        animationSetData.sequences.forEach(animation => 
        {
            const {sequence, name} = animation;
            const seqRects = sequence.map(frame => 
            {
                const frameIndex = spriteIndex + frame[0] + (frame[1]*spriteSheet.rows);
                return spriteSheet.data[frameIndex];
            });
            
            this.set(name, seqRects);
        });

        listAnimationSets.set(this.name, this);
    }

    public set (key : string, values : SpriteRect[])
    {
        this.map.set(key, values);
    }

    public has (key : string) : boolean
    {
        return this.map.has(key);
    }

    public get (key : string) : SpriteRect[]
    {
        return this.map.get(key)!;
    }
}

export class GameSprite
{
    protected spriteSheet : SpriteSheet;
    public index : number;
    public spriteRect : SpriteRect;

    public async load ({spriteSheet} : ISpriteData)
    {
        this.spriteSheet = await SpriteSheet.load(spriteSheet);
        this.spriteRect = this.getRect ();
    }

    public static create (spriteData : ISpriteData)
    {
        if((spriteData as any).animationSet)
        {
            return new AnimatedSprite(spriteData as ISpriteAnimatedData);
        }
        else
        {
            return new GameSprite(spriteData);
        }
    }

    protected constructor (spriteData : ISpriteData)
    {
        const {spriteSheet, spriteIndex} = spriteData;
        this.index = spriteIndex;
        this.spriteSheet = (null as unknown) as SpriteSheet;
        this.spriteRect = (null as unknown) as SpriteRect;
        this.load(spriteData);
    }

    public set spriteIndex (i : number)
    {
        this.index = i;
        this.getRect ();
    }

    public get spriteIndex ()
    {
        return this.index;
    }

    public getRect ()
    {
        return this.spriteSheet?.data[this.index];
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
    
}

export class AnimatedSprite extends GameSprite
{
    protected frame : number;
    protected frameTime : number;
    public animationName : string;
    protected animations : AnimationSet

    public async load ({spriteSheet, spriteIndex, animationSet} : ISpriteAnimatedData)
    {
        this.spriteSheet = await SpriteSheet.load(spriteSheet);
        const animData = await loadAnimationSet(animationSet);
        this.animations = new AnimationSet(this.spriteSheet, animData, spriteIndex);
    }

    constructor (spriteData : ISpriteAnimatedData)
    {
        super(spriteData);
        this.frame = 0;
        this.frameTime = 0;
        this.animationName = "idle down";
        this.animations = (null as unknown) as AnimationSet;
        this.load(spriteData);
    }

    public draw(context : CanvasRenderingContext2D, posX : number, posY : number, size : number, rotation : number = 0) 
    {
        if(!this.spriteSheet || !this.animations) return;

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

export { SpriteSheet, SpriteRect, ISpriteData, ISpriteAnimatedData, IAnimationSetsData };