import { ISpriteData } from "./spriteData";

export interface ISpriteAnimatedData extends ISpriteData
{
    spriteSheet : string,
    spriteIndex : number,
    animationSet : string
}