import { ICharacterData, IGameObjectData } from "./models";
import { AnimatedSprite, GameSprite } from "./gamesprite";
export { AnimatedSprite, GameSprite, ICharacterData, IGameObjectData };
export { SpriteSheet, SpriteRect, ISpriteData, ISpriteAnimatedData, IAnimationSetsData } from "./gamesprite";

export class GameObject 
{
    public static context : CanvasRenderingContext2D;
    public id : string;
    public name : string;
    public x : number;
    public y : number;
    public size : number;
    public rotation : number;
    public sprite : GameSprite;

    constructor (id : string, gameObjectData : IGameObjectData, x : number, y : number, rotation : number = 0)
    {
        this.id = id;
        this.name = gameObjectData.name;
        this.x = x;
        this.y = y;
        this.size = gameObjectData.size;
        this.sprite = GameSprite.create(gameObjectData.sprite);
        this.rotation = rotation;
    }

    public draw ()
    {
        this.sprite.draw(GameObject.context, this.x, this.y, this.size, this.rotation);
    }
}

export class AnimatedObject extends GameObject
{
    constructor (id : string, characterData : ICharacterData, x : number, y : number, rotation : number = 0)
    {
        super(id, characterData, x, y, rotation);
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
        super.draw();
    }
}