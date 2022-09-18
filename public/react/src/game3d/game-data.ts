import charactersData from "./data/characters.json";
import eventsData from "./data/events.json";
import { Camera, Group, Object3D, Scene } from "three";
import { fbx, gltf } from "./utils/loaders";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { IGameObjectData } from "./gameobject";
import { ICharacterData } from "./character";
import { createGameState } from "./utils/game-state";

const types = {
    ".glp": gltf,
    ".gltf": gltf,
    ".fbx": fbx
}

class GameData 
{
    public state : {scene : Scene, camera : Camera, render : () => void}
    public meshs : Map<string, Object3D>;
    public eventsData : IGameObjectData[];
    public charactersData : ICharacterData[];
    private _isLoaded : boolean;

    constructor ()
    {
        this.meshs = new Map<string, Group>();
        this.eventsData = eventsData;
        this.charactersData = charactersData;
        this._isLoaded = false;
        this.state = createGameState();
    }

    get isLoaded ()
    {
        return this._isLoaded;
    }

    async loadMesh (path : string) : Promise<Object3D>
    {
        const type = path.match(/.(\w{1,})/gi)![0];
        return await ((types as any)[type]).load(path);
    }

    async load ()
    {
        const meshPath = "/src/assets/meshs/";
        for (const characterData of charactersData) 
        {
            if(this.meshs.has(characterData.mesh)) continue;
            const mesh = await loadMesh(`${meshPath}${characterData.mesh}`);
            this.meshs.set(characterData.mesh, mesh);
        };

        for (const eventData of eventsData) 
        {
            if(this.meshs.has(eventData.mesh)) continue;
            const mesh = await loadMesh(`${meshPath}${eventData.mesh}`);
            this.meshs.set(eventData.mesh, mesh);
        };

        this._isLoaded = true;
    }
}

const gameData = new GameData();

export { gameData };