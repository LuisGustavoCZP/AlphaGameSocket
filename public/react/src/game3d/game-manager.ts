import { Character } from "./character";
import { GameObject } from "./gameobject";
import { IPlayerData, Player } from "./player";
import { waitUntil } from "./utils/wait";
import { MapObject } from "./map";
import { gameData } from "./game-data";
import Maths from "./utils/maths";
import { Mesh, MeshBasicMaterial, MeshToonMaterial, TextureLoader, Vector3 } from "three";
import Stats from "three/examples/jsm/libs/stats.module"

class GameManager 
{
    public map : MapObject;
    
    public gameObjects : Map<string, GameObject>;
    public players : Player[];
    public player : number;
    public round : number;
    public turn : number;

    private stats : Stats | undefined;
    
    constructor () 
    {
        this.gameObjects = new Map<string, GameObject>();
        this.players = [];
        this.player = -1;
        this.map = (null as unknown) as MapObject;
        this.round = 0;
        this.turn = 0;
        
        this.createStats();
    }

    addGameObject (gameObject : GameObject)
    {
        if(this.gameObjects.has(gameObject.id)) return;
        this.gameObjects.set(gameObject.id, gameObject);
    }

    getGameObject (id : string)
    {
        if(!this.gameObjects.has(id)) return null;
        return this.gameObjects.get(id)!;
    }

    async setMap (map: any)
    {
        await waitUntil(() => gameData.isLoaded);
        gameManager.map = new MapObject();
        await gameManager.map.load(map);
    }

    async setPlayers (players : IPlayerData[])
    {
        await waitUntil(() => gameData.isLoaded);

        console.log("Players", players);
        players.forEach((playerData, index) => 
        {
            const objectid = `Player:${index}`;
            if(playerData.isPlayer) this.player = index;

            const charData = gameData.charactersData[playerData.character];
            const mesh = gameData.meshs.get(charData.mesh)!;
            const gameObject = new Character(objectid, charData.name, mesh, playerData.position, index);
            
            this.addGameObject(gameObject);
        });
    }

    animations ()
    {
        this.gameObjects.forEach(gameObject => 
        {
            gameObject.update();
        });

        if(this.map)
        {
            //console.log("Atualizando eventos")
            this.map.eventObjects.forEach(eventObject => 
            {
                eventObject.update();
            });
        }
    }

    cameraControl ()
    {
        if(this.player < 0) return;
        //console.log(this.player);

        const deltaTime = gameData.deltaTime;
        const orbit = gameData.orbit;

        const char = gameManager.gameObjects.get(`Player:${this.player}`)! as Character;
        const pos = new Vector3(char.position.x, char.position.y+1, char.position.z)
        if(orbit.target.distanceToSquared(pos) > 0.1)
        {
            const x = Maths.lerp(orbit.target.x, pos.x, deltaTime*5);
            const y = Maths.lerp(orbit.target.y, pos.y, deltaTime*5);
            const z = Maths.lerp(orbit.target.z, pos.z, deltaTime*5);
            orbit.target.set(x, y, z);
            orbit.update();
        }
    }

    createStats()
    {
        this.stats = Stats();
        this.stats.setMode(0);
  
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0';
        this.stats.domElement.style.top = '0';
        document.body.appendChild(this.stats.domElement);
    }

    update ()
    {
        this.cameraControl();
        this.animations();
        gameData.render();
        this.stats?.update();
    }
}

const gameManager = new GameManager ();
export { gameManager }