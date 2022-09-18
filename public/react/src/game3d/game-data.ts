import charactersData from "./data/characters.json";
import eventsData from "./data/events.json";
import { Camera, Clock, Group, Object3D, Scene } from "three";
import { fbx, gltf } from "./utils/loaders";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { IGameObjectData } from "./gameobject";
import { ICharacterData } from "./character";
import { createGameState } from "./utils/game-state";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const types = {
    ".glb": gltf,
    ".gltf": gltf,
    ".fbx": fbx
}

class GameData 
{
    private state : {scene : Scene, camera : Camera, render : () => void, orbitcontrols : OrbitControls, clock : Clock}
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
        this.state = null as any;
    }

    get isLoaded ()
    {
        return this._isLoaded;
    }

    get scene ()
    {
        return this.state.scene;
    }

    get camera ()
    {
        return this.state.camera;
    }

    get orbit ()
    {
        return this.state.orbitcontrols;
    }

    get clock ()
    {
        return this.state.clock;
    }

    render ()
    {
        this.state.render();
    }

    async loadMesh (path : string) : Promise<Object3D>
    {
        const type = path.match(/\.(\w{1,})/gi)![0];
        console.log(type);
        return await ((types as any)[type]).load(path);
    }

    async load ()
    {
        const meshPath = "/src/assets/meshs/";
        for (const characterData of charactersData) 
        {
            if(this.meshs.has(characterData.mesh)) continue;
            const mesh = await this.loadMesh(`${meshPath}${characterData.mesh}`);
            this.meshs.set(characterData.mesh, mesh);
        };

        for (const eventData of eventsData) 
        {
            if(this.meshs.has(eventData.mesh)) continue;
            const mesh = await this.loadMesh(`${meshPath}${eventData.mesh}`);
            this.meshs.set(eventData.mesh, mesh);
        };

        this._isLoaded = true;
        console.log("Terminou de carregar!")
    }

    async start ()
    {
        this.state = createGameState();
    }
}

const gameData = new GameData();

export { gameData };