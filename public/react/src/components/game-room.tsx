import { useContext, useEffect, useState } from "react";
import { Connection } from "../connection";
import { GlobalContext, PlayerContext } from "../contexts";
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
    const { gameserver } = useContext(GlobalContext);
    const { connection, setConnection, setPage, getUserData, getMatchID } = useContext(PlayerContext);
    const [ connected, setConnected ] = useState<boolean>(false);

    async function startGame () 
    {
        const newconnection = new Connection(gameserver);
        
        newconnection.on("onopen", () => 
        {
            newconnection.on("onclose", () => 
            {
                gameManager.clear();
                setConnection(null as any);
                setPage(0);
            });

            newconnection.on("match-ready", () => 
            {
                setConnection(newconnection);
                setConnected(true);
            });
            newconnection.send("player-init", getUserData.id);
        });
    }

    useEffect(() => 
    {
        startGame ();
    }, []);

    if(!connected) return (<></>);
    return (
        <main className="flex justify-between items-center h-screen w-full p-2">
            <GameState connection={connection}/>
            <GameScreen connection={connection}/>
            <ChatScreen connection={connection}/>
        </main>
    );
}