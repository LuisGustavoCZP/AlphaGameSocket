import { useContext, useEffect, useState } from "react";
import { Connection } from "../connection";
import GlobalContext from "../contexts/global-context";
import { gameManager } from "../game/gamedata";
import { ChatScreen } from "./chat-screen";
import { GameScreen } from "./game-screen";
import { GameState } from "./game-state";

export interface IGameProps 
{
    connection : Connection
}

export function GameRoom (props : any)
{
    const [getSocket, setSocket] = useState<Connection>(null as any);
    const {getID} = useContext(GlobalContext);

    async function startGame () 
    {
        /* if(getSocket) return; */
        const newconnection = new Connection("localhost:5000");
        
        newconnection.on("onopen", () => 
        {
            newconnection.on("match-map", (map) => 
            {
                console.log("Recebendo mapa!")
                gameManager.setMap(map);
            });
            newconnection.on("match-ready", () => 
            {
                setSocket(newconnection);
                
                newconnection.send("match-init", true);
            });
            newconnection.send("player-init", getID);
        });
    }

    useEffect(() => 
    {
        startGame ();
    }, []);

    return (
        <main className="flex justify-between items-center h-screen w-full">
            <GameState connection={getSocket}/>
            <GameScreen connection={getSocket}/>
            <ChatScreen connection={getSocket}/>
        </main>
    );
}