import { GameObject } from "./gameobject";
import { ICharacterData } from "./models";
import { AnimatedSprite, SpriteSheet, GameSprite } from "./sprites";

const canvas = document.createElement("canvas");
canvas.width = 300;
canvas.height = 300;
const canvasContext = canvas.getContext("2d")!;
document.body.appendChild(canvas);
GameObject.context = canvasContext;
const gameObjects : GameObject[] = [];

async function loadCharacters ()
{
    const charactersData : ICharacterData[] = await fetch("/data/characters.json").then(resp => resp.json());
    for(const characterData of charactersData)
    {
        const createdSheet = await SpriteSheet.getSpriteSheet(characterData.sprite.frame, characterData.sprite.src);
        const animatedSprite = new AnimatedSprite (createdSheet, characterData.sprite.id, characterData.sprite.animations);
        const gameObject = new GameObject(animatedSprite, (Math.random()*150)+75, (Math.random()*150)+75, 32);

        gameObjects.push(gameObject);
    };
}

async function start () 
{
    await loadCharacters ();
    draw ();
} 

function draw () 
{
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    gameObjects.forEach(gameObject => 
    {
        gameObject.draw();
    })
    //console.log("desenhando");
    requestAnimationFrame(draw);
}

start ();



