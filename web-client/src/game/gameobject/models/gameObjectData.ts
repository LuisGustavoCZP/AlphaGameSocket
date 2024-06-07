import { ISpriteData } from "../gamesprite/models/spritedata";

export interface IGameObjectData 
{
    id: number,
    name : string,
    sprite : ISpriteData,
    size : number
}