import { AnimatedObject, GameObject } from "./gameobject";
import { ICharacterData } from "./models";
import { AnimatedSprite, SpriteSheet, GameSprite } from "./sprites";

const canvas = document.createElement("canvas");
canvas.width = 300;
canvas.height = 300;
const canvasContext = canvas.getContext("2d")!;
document.body.appendChild(canvas);
GameObject.context = canvasContext;
const gameObjects : GameObject[] = [];

let player : AnimatedObject;
let movingX : number = 0;
let movingY : number = 0;
let isControlling : boolean = false;

const controls = {
    "w": {down: ()=>{ movingY = -1 }, up: ()=>{ movingY = 0 }},
    "s": {down: ()=>{ movingY = 1 }, up: ()=>{ movingY = 0 }},
    "a": {down: ()=>{ movingX = -1 }, up: ()=>{ movingX = 0 }},
    "d": {down: ()=>{ movingX = 1 }, up: ()=>{ movingX = 0 }},
    "ArrowUp" : {down: ()=>{ movingY = -1 }, up: ()=>{ movingY = 0 }},
    "ArrowDown": {down: ()=>{ movingY = 1 }, up: ()=>{ movingY = 0 }},
    "ArrowLeft": {down: ()=>{ movingX = -1 }, up: ()=>{ movingX = 0 }},
    "ArrowRight": {down: ()=>{ movingX = 1 }, up: ()=>{ movingX = 0 }}
};

function controlling ()
{
    if(movingX == 0 && movingY == 0) 
    {
        player.animation = player.animation.replace("walk", "idle");
        //console.log(player.animation);
        isControlling = false;
        return;
    }

    if(movingX) 
    {
        player.x += movingX;
        if(movingX > 0) player.animation = "walk right";
        else player.animation = "walk left";
    }
    if(movingY) 
    {
        player.y += movingY;
        if(movingY > 0) player.animation = "walk down";
        else player.animation = "walk up";
    }

    setTimeout(controlling, 10);
    //console.log(`pressed ${movingX}${movingY}`);
}

window.addEventListener("keydown", (e) => 
{
    const control = (controls as any)[e.key];
    if(!control) return;
    control.down();
    if(!isControlling) 
    {
        isControlling = true;
        controlling ();
    }
});

window.addEventListener("keyup", (e) => 
{
    const control = (controls as any)[e.key];
    if(!control) return;
    control.up();
});

async function loadCharacters ()
{
    const charactersData : ICharacterData[] = await fetch("/data/characters.json").then(resp => resp.json());
    for(const characterData of charactersData)
    {
        const createdSheet = await SpriteSheet.getSpriteSheet(characterData.sprite.frame, characterData.sprite.src);
        const animatedSprite = new AnimatedSprite (createdSheet, characterData.sprite.id, characterData.sprite.animations);
        const gameObject = new AnimatedObject(animatedSprite, (Math.random()*150)+75, (Math.random()*150)+75, 32);
        if(!player) player = gameObject;
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



