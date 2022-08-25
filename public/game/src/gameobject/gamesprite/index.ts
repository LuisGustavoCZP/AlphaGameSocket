import { SpriteSheet, SpriteRect } from "../../spriteobject";
import { IAnimationSetsData, ISpriteData, ISpriteAnimatedData } from "./models";

const listAnimationSetsData = new Map<string, IAnimationSetsData>();
const listAnimationSets = new Map<string, AnimationSet>();

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

export class GameSprite
{
    protected spriteSheet : SpriteSheet;
    protected spriteRect : SpriteRect;
    public index : number;
    
    constructor ({spriteSheet, spriteIndex} : ISpriteData)
    {
        this.index = spriteIndex;
        this.spriteSheet = SpriteSheet.getByName(spriteSheet)!;
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

        animationSetData.sequences.forEach(animation => 
        {
            const {sequence, name} = animation;
            const seqRects = sequence.map(frame => 
            {
                const frameIndex = spriteIndex + frame[0] + (frame[1]*this.spriteSheet.rows);
                return this.spriteSheet.data[frameIndex];
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

export { SpriteSheet, SpriteRect, ISpriteData, ISpriteAnimatedData, IAnimationSetsData };