import { IGameObjectData } from "../gameobject";

export interface ICharacterData extends IGameObjectData
{
    id: number,
    name : string,
    mesh : string,
    size : number
}