import { AnimatedSprite, GameSprite } from "./sprites";

export class GameObject 
{
    public static context : CanvasRenderingContext2D;
    public x : number;
    public y : number;
    public size : number;
    public rotation : number;
    public sprite : GameSprite;

    constructor (sprite : GameSprite, x : number, y : number, size : number, rotation : number = 0)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.sprite = sprite;
        this.rotation = rotation;
    }

    public draw ()
    {
        this.sprite.draw(GameObject.context, this.x, this.y, this.size);
    }
}

export class AnimatedObject extends GameObject
{
    constructor (sprite : AnimatedSprite, x : number, y : number, size : number, rotation : number = 0)
    {
        super(sprite, x, y, size, rotation);
    }

    set animation (name : string)
    {
        const sa = (this.sprite as AnimatedSprite);
        sa.animationName = name;
    }

    get animation ()
    {
        return (this.sprite as AnimatedSprite).animationName;
    }

    public draw ()
    {
        this.sprite.draw(GameObject.context, this.x, this.y, this.size);
    }
}