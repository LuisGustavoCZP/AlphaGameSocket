import { ISpriteData } from "../gamesprites/models/spritedata";

export interface IGameObjectData 
{
    name : string,
    sprite : ISpriteData,
    size : number
}