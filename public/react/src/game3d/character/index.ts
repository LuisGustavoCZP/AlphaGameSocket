import { AnimationClip, Group, Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { GameObject } from "../gameobject";
import { ICharacterData } from "./models";
import { AnimationMixer } from "three";

export type { ICharacterData };

export class Character extends GameObject
{
    public playerIndex : number;
    protected animations : Map<string, AnimationClip>;
    protected mixer : AnimationMixer;

    constructor(id : string, name : string, mesh : Object3D, tileIndex : number, playerIndex : number)
    {
        const animations = new Map<string, AnimationClip>();
        if(mesh.animations && mesh.animations.length > 0)
        {
            mesh.animations.forEach(animation => 
            {
                animations.set(animation.name, animation);
            });
        }

        super(id, name, mesh, tileIndex);
        
        this.animations = animations;
        this.mixer = new AnimationMixer(this.mesh);
        if(this.animations.has("Idle")) this.mixer.clipAction(this.animations.get("Idle")!).play();
        
        this.playerIndex = playerIndex;
        const i = (playerIndex%2), j = ((playerIndex) - i)/2;
        const size = 2.5;

        this.offset((size/2) + (i*size) - size*2, 0, (size/2) + (j*size) - size*2);
    }

    public set animation (name : string)
    {
        if(this.animations.has(name)) this.mixer.clipAction(this.animations.get(name)!).play();
    }
}

