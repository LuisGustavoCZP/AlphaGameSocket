import { useEffect, useRef, useState } from "react";
import { CharacterObject } from "../game/characterobject";
import { gameManager } from "../game/gamedata";
import { GameObject } from "../game/gameobject";
import { MapObject } from "../game/mapobject";
import { IMapData } from "../game/mapobject/models";
import { IGameProps } from "./game-room";

export function GameScreen ({connection} : IGameProps)
{
    /* const [getCanvas, setCanvas] = useState<HTMLCanvasElement>();
    const canvasRef = useRef<HTMLCanvasElement>(null) */

    function network ()
    {
        if(connection)
        {
            connection.on("match-map", async (map) => 
            {
                console.log("Recebendo mapa!")
                await gameManager.setMap(map);
                
                connection.send("match-map", true);
            });
            connection.send("match-init", true);

            connection.on("match-players", (_players) => 
            {
                gameManager.setPlayers(_players);
            });
            connection.on("starting-move", ({playerindex, move}) => 
            {
                const char = gameManager.gameObjects.get(`player:${playerindex}`)! as CharacterObject;
                char.animation = "walk down";
                connection.on("finish-move", ({turn, round}) => 
                {
                    char.animation = "idle down";
                });
            });

            connection.on("update-move", ({playerindex, position, tile}) => 
            {
                const char = gameManager.gameObjects.get(`player:${playerindex}`)! as CharacterObject;
                char.tileIndex = tile;
            });

        }
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
    
    useEffect(() => 
    {
        const canvasEl = document.getElementById("canvas-screen");
        if(canvasEl) 
        {
            const canvas = canvasEl as HTMLCanvasElement;
            const context = canvas.getContext("2d")!;
            GameObject.context = context;
            MapObject.context = context;
            
            draw(context, canvas);
            network();
        }
        
    }, []);

    return (<canvas id="canvas-screen" className="flex bg-black flex-grow aspect-square max-h-screen" width={528} height={528}></canvas>);
}