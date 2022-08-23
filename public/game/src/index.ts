import { GameData } from "./gamedata";
import { AnimatedObject, GameObject } from "./gameobject";
import { GameRender } from "./gamerender";
import { ICharacterData, IGameObjectData } from "./models";
import { PlayerController } from "./playercontroller";
import { loadAnimationSets, loadSpriteSheets } from "./sprites";
import Connection from "./connection";

const gameRender = new GameRender(512, 512);
const playerController = new PlayerController();
const connection = new Connection(window.location.host.replace("8000", "5000")); //window.location.host

async function loadAssets ()
{
    await loadSpriteSheets(await fetch("/data/spritesheets.json").then(resp => resp.json()));
    await loadAnimationSets(await fetch("/data/animationsets.json").then(resp => resp.json()));   

    const objectsData : IGameObjectData[] = await fetch("/data/objects.json").then(resp => resp.json());
    for(const objectData of objectsData)
    {
        const gameObject = new GameObject("test2", objectData, (Math.random()*150)-75, (Math.random()*150)-75, 0);
        console.log(gameObject);
        if(!playerController.player) playerController.player = gameObject;
        GameData.addGameObject(gameObject);
    };
/* 
    const charactersData : ICharacterData[] = await fetch("/data/characters.json").then(resp => resp.json());
    for(const characterData of charactersData)
    {
        const gameObject = new AnimatedObject("test1", characterData, (Math.random()*150)-75, (Math.random()*150)-75, 0);
        console.log(gameObject)
        if(!playerController.player) playerController.player = gameObject;
        GameData.addGameObject(gameObject);
    };
*/
}

async function start () 
{
    await loadAssets ();
    gameRender.draw ();
} 

start ();



