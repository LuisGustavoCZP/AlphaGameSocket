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
    const {getID, setPage, gameserver} = useContext(GlobalContext);

    async function startGame () 
    {
        /* if(getSocket) return; */

        const newconnection = new Connection(gameserver);
        
        newconnection.on("onopen", () => 
        {
            newconnection.on("onclose", () => 
            {
                setPage(0);
            });

            newconnection.on("match-ready", () => 
            {
                setSocket(newconnection);
            });
            newconnection.send("player-init", getID);
        });
    }

    useEffect(() => 
    {
        startGame ();
    }, []);

    if(!getSocket) return (<></>);
    return (
        <main className="flex justify-between items-center h-screen w-full p-2">
            <GameState connection={getSocket}/>
            <GameScreen connection={getSocket}/>
            <ChatScreen connection={getSocket}/>
        </main>
    );
}