import { AnimatedSprite, GameSprite } from "./sprites";

export class GameObject 
{
    public static context : CanvasRenderingContext2D;
    public x : number;
    public y : number;
    public size : number;
    public sprite : GameSprite;

    constructor (sprite : GameSprite, x : number, y : number, size : number,)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.sprite = sprite;
    }

    set animation (name : string)
    {
        const sa = (this.sprite as AnimatedSprite);
        sa.animation = name;
    }

    get animation ()
    {
        return (this.sprite as AnimatedSprite).animation;
    }

    public draw ()
    {
        this.sprite.draw(GameObject.context, this.x, this.y, this.size);
    }
}