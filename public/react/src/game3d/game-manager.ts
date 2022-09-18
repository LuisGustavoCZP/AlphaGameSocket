import { Character } from "./character";
import { GameObject } from "./gameobject";
import { IPlayerData, Player } from "./player";
import { waitUntil } from "./utils/wait";
import { MapObject } from "./map";
import { gameData } from "./game-data";

class GameManager 
{
    public map : MapObject;
    
    public gameObjects : Map<string, GameObject>;
    public players : Player[];
    public round : number;
    public turn : number;

    constructor () 
    {
        this.gameObjects = new Map<string, GameObject>();
        this.players = [];
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
        gameManager.map = new MapObject(map);
        gameManager.map.updateEvents(map.data);
    }

    async setPlayers (players : IPlayerData[])
    {
        await waitUntil(() => gameData.isLoaded);

        players.forEach((playerData, index) => 
        {
            const objectid = `Player:${index}`;
            const charData = gameData.charactersData[playerData.character];
            const mesh = gameData.meshs.get(charData.mesh)!;

            const gameObject = new Character(objectid, charData.name, mesh, playerData.position, index);
            this.addGameObject(gameObject);
        });
    }
}

const gameManager = new GameManager ();
export { gameManager }