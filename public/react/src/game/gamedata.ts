import { CharacterObject } from "./characterobject";
/* import { connection } from "./connection"; */
import { GameObject, ICharacterData } from "./gameobject";
import { MapObject } from "./mapobject";
import { Player } from "./player";
import { IPlayerData } from "./player/models";
import { waitUntil } from "./utils/wait";

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

    async setMap (map : any)
    {
        console.log("Setando mapa!")
        gameManager.map = new MapObject(await fetch("./src/assets/maps/tilemaps/tabuleiro.tmj")
        //.then(resp => {console.log(resp.text()); return resp;})
        .then(resp => resp.json()));
        await waitUntil(() => gameManager.map.tilesets.length > 0);
        /* connection.add("match-players", (resp) => this.setPlayers(resp));
        connection.remove("match-map");
        connection.send("match-map", true); */
    }

    async setPlayers (players : IPlayerData[])
    {
        const charactersData : ICharacterData[] = await fetch("./src/assets/data/characters.json").then(resp => resp.json());
        players.forEach((playerData, index) => 
        {
            const objectid = `player:${index}`;
            const charData = charactersData[playerData.character];
            const gameObject = new CharacterObject(objectid, charData, index, playerData.position);
            //console.log(tile, gameObject);
            this.addGameObject(gameObject);
            /* const player = new Player(index, playerData.name, objectid, playerData.position, playerData.points);
            this.players.push(player as Player);  */
        });
        console.log(gameManager.gameObjects);
        /* connection.add("match-round", (data) => this.round = data);
        connection.add("match-turn", (data) => this.turn = data);
        connection.remove("match-players");
        connection.send("match-players", true); */
    }
}

const gameManager = new GameManager ();
export { gameManager }