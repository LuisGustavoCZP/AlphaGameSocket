import { GameData } from "./gamedata";
import { AnimatedObject, GameObject } from "./gameobject";
import { GameRender } from "./gamerender";
import { ICharacterData, IGameObjectData } from "./gameobject";
import { playerController } from "./playercontroller";
import { loadAnimationSets } from "./gameobject/gamesprite";
import { SpriteSheet } from "./spriteobject";
import { connection } from "./connection";
import { MapObject } from "./mapobject";

const gameRender = new GameRender(640, 640);

async function loadAssets ()
{
    //await SpriteSheet.build(await SpriteSheet.load("/data/spritesheets.json"));
    //await loadAnimationSets(await fetch("/data/animationsets.json").then(resp => resp.json()));  
    GameData.map = new MapObject(await fetch("/assets/tilemaps/mapa1.tmj").then(resp => resp.json()));

    const objectsData : IGameObjectData[] = await fetch("/data/objects.json").then(resp => resp.json());
    for(const objectData of objectsData)
    {
        const gameObject = new GameObject("test2", objectData, (Math.random()*150)-75, (Math.random()*150)-75, 0);
        console.log(gameObject);
        //if(!playerController.player) playerController.player = gameObject;
        GameData.addGameObject(gameObject);
    };

    const charactersData : ICharacterData[] = await fetch("/data/characters.json").then(resp => resp.json());
    for(const characterData of charactersData)
    {
        const gameObject = new AnimatedObject("test1", characterData, (Math.random()*150)-75, (Math.random()*150)-75, 0);
        console.log(gameObject)
        if(!playerController.player) playerController.player = gameObject;
        GameData.addGameObject(gameObject);
    };

}

async function start () 
{
    await loadAssets ();
    gameRender.draw ();
} 

start ();



