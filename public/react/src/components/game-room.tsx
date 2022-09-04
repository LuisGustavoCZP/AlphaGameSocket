import { useContext, useEffect, useState } from "react";
import GlobalContext from "../contexts/global-context";
import { ChatScreen } from "./chat-screen";
import { GameState } from "./game-state";

export function GameRoom (props : any)
{
    const {getID} = useContext(GlobalContext);
    return (
        <main className="flex justify-between items-center h-screen w-full">
            <GameState/>
            <canvas className="flex bg-black flex-grow aspect-square" width={528} height={528}></canvas>
            <ChatScreen/>
        </main>
    );
}