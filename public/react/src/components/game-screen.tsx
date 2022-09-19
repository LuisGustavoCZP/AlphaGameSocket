import { useEffect, useRef, useState } from "react";
import { gameManager, gameData, Character } from "../game3d";
import { IGameProps } from "./game-room";

export function GameScreen ({connection} : IGameProps)
{
    const canvasRef = useRef<HTMLCanvasElement>(null)

    function network ()
    {
        if(connection)
        {
            connection.on("match-map", async (map) => 
            {
                console.log("Recebendo mapa!");
                await gameManager.setMap(map);
                
                connection.send("match-map", true);
            });
            connection.send("match-init", true);

            connection.on("match-players", (_players) => 
            {
                gameManager.setPlayers(_players);
                update ();
            });

            connection.on("starting-move", ({playerindex, move}) => 
            {
                const char = gameManager.gameObjects.get(`Player:${playerindex}`)! as Character;
                char.animation = "Walk";
                connection.on("finish-move", ({turn, round}) => 
                {
                    char.animation = "Idle";
                });
            });

            connection.on("update-move", ({playerindex, position, tile}) => 
            {
                const char = gameManager.gameObjects.get(`Player:${playerindex}`)! as Character;
                char.tile = tile;
            });
        }
    }

    async function gameStart ()
    {
        await gameData.start();
        network ();
    }

    useEffect(() => 
    {
        gameStart ();
    }, []);

    function update () 
    {
        requestAnimationFrame(() => update());
        gameManager.update();
    }

    return <canvas ref={canvasRef} id="canvas-screen" className="flex bg-black flex-grow aspect-square" width={528} height={528}></canvas>;
}