import { GameData } from "./gamedata";
import { AnimatedObject, GameObject } from "./gameobject";
import { GameRender } from "./gamerender";
import { ICharacterData } from "./models";
import { PlayerController } from "./playercontroller";
import { loadAnimationSets, loadSpriteSheets } from "./sprites";

const gameRender = new GameRender(300, 300);
const playerController = new PlayerController();

async function loadAssets ()
{
    await loadSpriteSheets(await fetch("/data/spritesheets.json").then(resp => resp.json()));
    await loadAnimationSets(await fetch("/data/animationsets.json").then(resp => resp.json()));   

    const charactersData : ICharacterData[] = await fetch("/data/characters.json").then(resp => resp.json());
    for(const characterData of charactersData)
    {
        const gameObject = new AnimatedObject("test123", characterData, (Math.random()*150)-75, (Math.random()*150)-75, 180);
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



