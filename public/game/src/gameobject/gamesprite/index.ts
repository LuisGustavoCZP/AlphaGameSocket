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

    const data = await fetch(`/data/animationsets/${source}`).then(resp => resp.json()) as IAnimationSetsData;
    listAnimationSetsData.set(source, data);
    return data;
}

export class AnimationSet extends Map<string, SpriteRect[]>
{
    public name : string;
    constructor (spriteSheet : SpriteSheet, animationSetData : IAnimationSetsData, spriteIndex : number)
    {
        super();
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
}

export class GameSprite
{
    protected spriteSheet : SpriteSheet;
    protected spriteRect : SpriteRect;
    public index : number;
    
    public async load ({spriteSheet, spriteIndex} : ISpriteData)
    {
        this.spriteSheet = await SpriteSheet.load(spriteSheet);
    }

    public static create (spriteData : ISpriteData)
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

    protected constructor ({spriteSheet, spriteIndex} : ISpriteData)
    {
        this.index = spriteIndex;
        this.spriteSheet = (null as unknown) as SpriteSheet;
        //SpriteSheet.load(spriteSheet)!;
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
        return this.spriteSheet.data[this.index];
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