import { Group, Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { GameObject } from "../gameobject";
import { ICharacterData } from "./models";
export type { ICharacterData };

export class Character extends GameObject
{
    public playerIndex : number;
    

    constructor(id : string, name : string, mesh : Object3D, tileIndex : number, playerIndex : number)
    {
        super(id, name, mesh, tileIndex);
        this.playerIndex = playerIndex;
    }

}

