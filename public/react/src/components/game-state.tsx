import { InventoryState } from "./inventory-state";
import { PlayersState } from "./players-state";
import { SpecsUser } from "./specsuser";
import {ModalPergunta} from './modalpergunta'
import { IGameProps } from "./game-room";
import { useState } from "react";

export function GameState ({connection} : IGameProps)
{
    const [players, setPlayers] = useState();
    if(connection)
    {
        connection.on("match-players", (_players) => 
        {
            setPlayers(_players);
        })
    }
    return (
    <section className="flex flex-col h-full w-full min-w-[200px] max-w-[400px] gap-4">
        <SpecsUser />
        <PlayersState />
        <InventoryState />
        {/* <ModalPergunta/> */}
    </section>
    );
}