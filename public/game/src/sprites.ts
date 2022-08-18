import { IAnimationsData, IAnimationSequenceData, IFrameData } from "./models";

export class SpriteSheet 
{
    public readyDraw : boolean;
    public spriteFrame : IFrameData;
    public spriteSource : string;
    public maxColumX : number;
    public maxColumY : number;
    public image : HTMLImageElement;

    static listSpriteSheets = new Map<string, SpriteSheet>();
    static async getSpriteSheet (spriteFrame : IFrameData, spriteSource : string) : Promise<SpriteSheet>
    {
        if(SpriteSheet.listSpriteSheets.has(spriteSource)) 
            return SpriteSheet.listSpriteSheets.get(spriteSource)!;

        const image = await SpriteSheet.loadSpriteImage (spriteSource);
        const spriteSheet = new SpriteSheet(spriteFrame, image);
        SpriteSheet.listSpriteSheets.set(spriteSource, spriteSheet);

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
        this.maxColumX = 0;
        this.maxColumY = 0;
        this.image = image;

        const fs = this.spriteFrame.space;
        const nw = this.spriteFrame.width + fs, nh = this.spriteFrame.height + fs;
        this.maxColumX = Math.ceil((this.image.width + fs) / (nw));
        this.maxColumY = Math.ceil((this.image.height + fs) / (nh));
        console.log(`${this.image.width} => [${this.maxColumX}, ${this.maxColumY}]`);
        this.readyDraw = true;
    }

    public getRect (index : number)
    {
        const w = this.spriteFrame.width, h = this.spriteFrame.height;
        const x = index % this.maxColumX;
        const y = (index - x) / this.maxColumY;

        const fw = this.spriteFrame.width;
        const fh = this.spriteFrame.height;
        const fs = this.spriteFrame.space;

        const fx = ((fw + fs) * x);
        const fy = ((fh + fs) * y);

        //console.log(fx, fy, fw, fh, x, y);
        return new SpriteRect(fx, fy, fw, fh, -w/2, -h/2)
    }

    public getSpriteSequence (index : number, animationMap : IAnimationsData)
    {
        const animSeq : AnimationSequence = new Map<string, SpriteRect[]> ();
        const ow = -this.spriteFrame.width/2, oh = -this.spriteFrame.height/2;
        const fw = this.spriteFrame.width;
        const fh = this.spriteFrame.height;
        const fs = this.spriteFrame.space;

        animationMap.forEach(animation => 
        {
            const {sequence, name} = animation;
            const seqRects = sequence.map(frame => 
            {
                const frameIndex = index + frame[0] + (frame[1]*this.maxColumX);
                const x = frameIndex % this.maxColumX;
                const y = (frameIndex - x) / this.maxColumX;
                
                const fx = ((fw + fs) * x);
                const fy = ((fh + fs) * y);

                return new SpriteRect(fx, fy, fw, fh, ow, oh);
            });
            
            animSeq.set(name, seqRects);
        });
        //console.log(animSeq, animationMap)
        return animSeq;
    }
}

export class SpriteRect 
{
    public x : number;
    public y : number;
    public width : number;
    public height : number;
    public offsetX : number;
    public offsetY : number;

    constructor (x : number, y : number, width : number, height : number, offsetX : number = 0, offsetY : number = 0)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}

export class GameSprite
{
    protected spriteSheet : SpriteSheet;
    protected spriteRect : SpriteRect;
    public index : number;
    
    constructor (spriteSheet : SpriteSheet, spriteIndex : number)
    {
        this.index = spriteIndex;
        this.spriteSheet = spriteSheet;
        this.spriteRect = spriteSheet.getRect(spriteIndex);
    }

    public set spriteIndex (i : number)
    {
        this.index = i;
        this.spriteRect = this.spriteSheet.getRect(i);
    }

    public get spriteIndex ()
    {
        return this.index;
    }

    draw(context : CanvasRenderingContext2D, posX : number, posY : number, size : number, rotation : number = 0) 
    {
        posX = posX - (size/2); //- this.spriteRect.offsetX;
        posY = posY - (size/2); //- this.spriteRect.offsetY;

        if(!this.spriteSheet) return;

        context.drawImage(
            this.spriteSheet.image!,
            this.spriteRect.x,
            this.spriteRect.y,
            this.spriteRect.width,
            this.spriteRect.height,
            posX, 
            posY,
            size,
            size
        );
    }
    
}

export type AnimationSequence = Map<string, SpriteRect[]>;

export class AnimatedSprite extends GameSprite
{
    protected frame : number;
    protected frameTime : number;
    public animation : string;
    protected animationSequence : AnimationSequence

    constructor (spriteSheet : SpriteSheet, spriteIndex : number, animationMap : IAnimationsData)
    {
        super(spriteSheet, spriteIndex);
        this.frame = 0;
        this.frameTime = 0;
        this.animation = "walk down";
        this.animationSequence = spriteSheet.getSpriteSequence(spriteIndex, animationMap);
    }

    draw(context : CanvasRenderingContext2D, posX : number, posY : number, size : number, rotation : number = 0) 
    {
        let sequence : SpriteRect[];
        if(this.animation)
        {
            sequence = this.animationSequence.get(this.animation)!;
            this.frameTime++;
            if(this.frameTime > 10) 
            {
                this.frameTime = 0;
                this.frame += 1;
                if(this.frame >= sequence.length) this.frame = 0;
            }
        } else {
            this.frame = 0;
            sequence = this.animationSequence.get("idle down")!;
        }

        this.spriteRect = sequence[this.frame];

        super.draw(context, posX, posY, size);
    }
    
}