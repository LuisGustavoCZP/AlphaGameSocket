import { GameObject } from "./gameobject/gameobject";

export class GameData 
{
    public static gameObjects : Map<string, GameObject> = new Map<string, GameObject>();

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