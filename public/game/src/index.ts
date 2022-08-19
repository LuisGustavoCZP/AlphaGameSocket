import { AnimatedObject, GameObject } from "./gameobject";
import { GameRender } from "./gamerender";
import { IAnimationSetsData, ICharacterData, ISpriteSheetData } from "./models";
import { PlayerController } from "./playercontroller";
import { AnimatedSprite, SpriteSheet, GameSprite, loadAnimationSets, loadSpriteSheets } from "./sprites";

const gameRender = new GameRender(300, 300, []);
const playerController = new PlayerController();

async function loadCharacters ()
{
    await loadSpriteSheets(await fetch("/data/spritesheets.json").then(resp => resp.json()));
    await loadAnimationSets(await fetch("/data/animationsets.json").then(resp => resp.json()));   

    const charactersData : ICharacterData[] = await fetch("/data/characters.json").then(resp => resp.json());
    for(const characterData of charactersData)
    {
        const animatedSprite = new AnimatedSprite (characterData.sprite);
        const gameObject = new AnimatedObject(animatedSprite, (Math.random()*150)+75, (Math.random()*150)+75, characterData.size);
        if(!playerController.player) playerController.player = gameObject;
        gameRender.gameObjects.push(gameObject);
    };
}

async function start () 
{
    await loadCharacters ();
    gameRender.draw ();
} 

start ();



