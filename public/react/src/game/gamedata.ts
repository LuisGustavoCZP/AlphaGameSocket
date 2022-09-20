import { CharacterObject } from "./characterobject";
/* import { connection } from "./connection"; */
import { GameObject, GameSprite, ICharacterData, IGameObjectData, SpriteSheet } from "./gameobject";
import { MapObject } from "./mapobject";
import { Player } from "./player";
import { IPlayerData } from "./player/models";
import { waitUntil } from "./utils/wait";

import eventsData from "../assets/data/events.json";
import charactersData from "../assets/data/characters.json";

export class GameManager 
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
        //const eventsData : IGameObjectData[] = await fetch(map.eventsSource).then(resp => resp.json());
        const eventsObject : GameObject[] = [];
        for (const eventData of eventsData)
        {
            await SpriteSheet.load(eventData.sprite.spriteSheet);
            const eventObject = new GameObject(`Events:${eventData.id}`, eventData, 0, 0);
            eventsObject.push(eventObject);
        }

        gameManager.map = new MapObject(await fetch(map.mapSource)
        .then(resp => resp.json()), eventsObject);
        gameManager.map.updateEvents(map.data);
        await waitUntil(() => gameManager.map.tilesets.length > 0);
    }

    async setPlayers (players : IPlayerData[])
    {
        //const charactersData : ICharacterData[] = characters;
        players.forEach((playerData, index) => 
        {
            const objectid = `player:${index}`;
            const charData = charactersData[playerData.character];
            const gameObject = new CharacterObject(objectid, charData, index, playerData.position);
            this.addGameObject(gameObject);
        });
    }
}

const gameManager = new GameManager ();
export { gameManager }