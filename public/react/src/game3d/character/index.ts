import { AnimationClip, Group, Object3D, Mesh } from "three";
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
       
        if(this.animations.has("Idle")) this.mixer!.clipAction(this.animations.get("Idle")!).play();

        this.playerIndex = playerIndex;
        const i = (playerIndex%2), j = ((playerIndex) - i)/2;
        const size = 2.5;

        this.offset((size/2) + (i*size) - size*2, 0, (size/2) + (j*size) - size*2);
    }

    public set animation (name : string)
    {
        if(this.animations.has(name)) this.mixer!.clipAction(this.animations.get(name)!).play();
    }
}

