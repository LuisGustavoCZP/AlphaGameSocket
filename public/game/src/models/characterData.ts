import { IGameObjectData } from "./gameObjectData";
import { ISpriteAnimatedData } from "./spritedata";

export interface ICharacterData extends IGameObjectData
{
    name : string,
    sprite : ISpriteAnimatedData,
    size : number
}