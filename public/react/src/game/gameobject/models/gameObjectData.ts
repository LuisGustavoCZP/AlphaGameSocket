import { ISpriteData } from "../gamesprite/models/spritedata";

export interface IGameObjectData 
{
    name : string,
    sprite : ISpriteData,
    size : number
}