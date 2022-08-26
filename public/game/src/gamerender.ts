import { GameData } from "./gamedata";
import { GameObject } from "./gameobject";
import { MapObject } from "./mapobject";

export class GameRender
{
    public canvas : HTMLCanvasElement;
    public context : CanvasRenderingContext2D;
    
    constructor (width : number = 300, height : number = 300)
    {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d")!;
        document.body.appendChild(this.canvas);
        GameObject.context = this.context;
        MapObject.context = this.context;
    }

    public draw () 
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        GameData.map?.draw();

        GameData.gameObjects.forEach(gameObject => 
        {
            gameObject.draw();
        })
        //console.log("desenhando");
        requestAnimationFrame(() => this.draw());
    }
}