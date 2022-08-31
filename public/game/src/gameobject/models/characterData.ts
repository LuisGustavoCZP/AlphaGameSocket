import { IGameObjectData } from "./gameObjectData";
import { ISpriteAnimatedData } from "../gamesprite/models/spritedata";

export interface ICharacterData extends IGameObjectData
{
    id: number,
    name : string,
    sprite : ISpriteAnimatedData,
    size : number
}