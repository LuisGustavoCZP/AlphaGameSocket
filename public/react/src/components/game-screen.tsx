import { useEffect, useRef, useState } from "react";
import { gameManager, gameData, Character } from "../game3d";
import { IGameProps } from "./game-room";

export function GameScreen ({connection} : IGameProps)
{
    const [getCanvas, setCanvas] = useState<HTMLCanvasElement>();
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

    useEffect(() => 
    {
        gameData.start();
        network ();
        render();
    }, []);

    function render () 
    {
        //console.log("Renderizando")
        requestAnimationFrame(() => render());
        gameData.render();
        gameManager.cameraControl();
    }

    return <canvas ref={canvasRef} id="canvas-screen" className="flex bg-black flex-grow aspect-square" width={528} height={528}></canvas>;
}