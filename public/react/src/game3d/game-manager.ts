import { Character } from "./character";
import { GameObject } from "./gameobject";
import { IPlayerData, Player } from "./player";
import { waitUntil } from "./utils/wait";
import { MapObject } from "./map";
import { gameData } from "./game-data";
import Maths from "./utils/maths";

class GameManager 
{
    public map : MapObject;
    
    public gameObjects : Map<string, GameObject>;
    public players : Player[];
    public player : number;
    public round : number;
    public turn : number;

    constructor () 
    {
        this.gameObjects = new Map<string, GameObject>();
        this.players = [];
        this.player = -1;
        this.map = (null as unknown) as MapObject;
        this.round = 0;
        this.turn = 0;
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
            //console.log(playerData)

            const charData = gameData.charactersData[playerData.character];
            const mesh = gameData.meshs.get(charData.mesh)!;
            
            const gameObject = new Character(objectid, charData.name, mesh, playerData.position, index);
            this.addGameObject(gameObject);
        });
    }

    cameraControl ()
    {
        if(this.player < 0) return;
        console.log(this.player);

        const deltaTime = gameData.clock.getDelta();
        const orbit = gameData.orbit;
        const camera = gameData.camera;

        const char = gameManager.gameObjects.get(`Player:${this.player}`)! as Character;
        const x = Maths.lerp(orbit.target.x, char.position.x, deltaTime*15);
        const y = Maths.lerp(orbit.target.y, char.position.y, deltaTime*15);
        const z = Maths.lerp(orbit.target.z, char.position.z, deltaTime*15);
        orbit.target.set(x, y, z);
        
        orbit.update();
    }
}

const gameManager = new GameManager ();
export { gameManager }