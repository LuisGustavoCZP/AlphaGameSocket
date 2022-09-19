import { AnimationClip, Group, Material, Mesh, Object3D, Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { gameData } from "../game-data";
import { IGameObjectData } from "./models";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { AnimationMixer } from "three";
export type { IGameObjectData };

export class GameObject 
{
    public id : string;
    public name : string;
    protected mesh : Object3D;
    private _tile : number;
    private _offset : Vector3;
    protected animations : Map<string, AnimationClip>;
    protected mixer : AnimationMixer | null;

    constructor (id : string, name : string, mesh : Object3D, tile : number, offset? : Vector3)
    {
        this.id = id;
        this.name = name;
        
        this._tile = -1;
        this._offset = offset? offset : new Vector3(-2.5, 0, -2.5);
        const model = SkeletonUtils.clone(mesh);
        this.mesh = model;
        this.mesh.position.set(0,0,0);
        this.tile = tile;
        this.mixer = null;

        const animations = new Map<string, AnimationClip>();
        if(mesh.animations && mesh.animations.length > 0)
        {
            mesh.animations.forEach(animation => 
            {
                animations.set(animation.name, animation);
            });

            this.mixer = new AnimationMixer(this.mesh);

            this.mixer!.clipAction(animations.get("Idle")!).play();
        }
        this.animations = animations;

        gameData.scene.add(this.mesh);
    }

    public get tile ()
    {
        return this._tile;
    }

    public set tile (index : number)
    {
        this._tile = index;

        const i = (index % 11), j = ((index) - i)/11;
        const size = 5;
        
        const x = (i * size) - 22.5 + this._offset.x;
        const y = (j * size) - 22.5 + this._offset.z;

        //console.log(index, `(${x}, ${0}, ${y})`);
        //const lpos = this.mesh.worldToLocal(new Vector3(x, this._offset.y, y));
        this.mesh.position.set(x, this._offset.y, y);
    }

    public offset (x : number, y : number, z : number)
    {
        this._offset.set(x, y, z);
        this.tile = this._tile;
    }

    public rotateY (y : number)
    {
        this.mesh.rotateY(y);
    }

    public get position ()
    {
        return this.mesh.position;
    }

    public get rotation ()
    {
        return this.mesh.rotation;
    }

    public update ()
    {
        if(!this.mixer) return;

        const delta = gameData.deltaTime;
        this.mixer!.update(delta);
    }

    public set material (material : Material)
    {
        this.mesh.traverse(function (child) 
        {
            if (child instanceof Mesh) 
            {
                child.material = material;
            }
        });
    }
}