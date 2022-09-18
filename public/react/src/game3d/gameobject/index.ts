import { Group, Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { gameData } from "../game-data";
import { IGameObjectData } from "./models";
export type { IGameObjectData };

export class GameObject 
{
    public id : string;
    public name : string;
    public mesh : Object3D;
    public tileIndex : number;

    constructor (id : string, name : string, mesh : Object3D, tileIndex : number)
    {
        this.id = id;
        this.name = name;
        this.mesh = mesh;
        this.tileIndex = tileIndex;
        gameData.state.scene.add(mesh);
    }
}