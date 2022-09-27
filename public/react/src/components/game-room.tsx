import { useContext, useEffect, useState } from "react";
import { Connection } from "../connection";
import { PlayerContext } from "../contexts";
import { gameManager } from "../game/gamedata";
import configs from "../utils/config";
import { AudioMixer } from "./audio";
import { Chat } from "./chat";
import { ChatScreen } from "./chat-screen";
import { GameScreen } from "./game-screen";
import { GameState } from "./game-state";

export interface IGameProps 
{
    connection : Connection
}

export function GameRoom (props : any)
{
    const { connection, setConnection, setPage, getUserData, getMatchID } = useContext(PlayerContext);
    const [ connected, setConnected ] = useState<boolean>(false);

    async function startGame () 
    {
        const newconnection = new Connection(configs.gameserver);
        
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
        const diceSound = new AudioMixer (['gamesoundtrack'])
        diceSound.play('gamesoundtrack','./src/assets/sounds/soudtrack06jazz.mp3')
        diceSound.loop('gamesoundtrack')
        return ()=>{diceSound.stop('gamesoundtrack')}
    }, []);

    if(!connected) return (<></>);
    return (
        <main className="flex justify-between items-center h-screen w-full p-2">
            <GameState connection={connection}/>
            <GameScreen connection={connection}/>
            <Chat/>
        </main>
    );
}