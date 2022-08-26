import { GameObject } from "./gameobject";
import { MapObject } from "./mapobject";

export class GameData 
{
    public static gameObjects : Map<string, GameObject> = new Map<string, GameObject>();
    public static map : MapObject;

    static addGameObject (gameObject : GameObject)
    {
        if(GameData.gameObjects.has(gameObject.id)) return;
        GameData.gameObjects.set(gameObject.id, gameObject);
    }

    static getGameObject (id : string)
    {
        if(!GameData.gameObjects.has(id)) return null;
        return GameData.gameObjects.get(id)!;
    }
}