import { useEffect, useRef, useState } from "react";
import { gameManager } from "../game/gamedata";
import { GameObject } from "../game/gameobject";
import { MapObject } from "../game/mapobject";
import { IMapData } from "../game/mapobject/models";
import { IGameProps } from "./game-room";

export function GameScreen ({connection} : IGameProps)
{
    const [getCanvas, setCanvas] = useState<HTMLCanvasElement>();
    const canvasRef = useRef<HTMLCanvasElement>(null)

    
    if(connection && canvasRef) 
    {
        console.log(connection);

        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        GameObject.context = context;
        MapObject.context = context;
        
        draw(context, canvas);
    }

    function draw (context : CanvasRenderingContext2D, canvas : HTMLCanvasElement) 
    {
        context.clearRect(0, 0, canvas.width, canvas.height);

        gameManager.map?.draw();

        gameManager.gameObjects.forEach(gameObject => 
        {
            gameObject.draw();
        })
        //console.log("desenhando");
        requestAnimationFrame(() => draw(context, canvas));
    }

    return <canvas ref={canvasRef} className="flex bg-black flex-grow aspect-square" width={528} height={528}></canvas>;
}