import { InventoryState } from "./inventory-state";
import { PlayersState } from "./players-state";
import { SpecsUser } from "./specsuser";
import { ModalPergunta } from './modalpergunta'
import { IGameProps } from "./game-room";
import { useState } from "react";
import { IPlayerData } from "../game/player";

export function GameState ({connection} : IGameProps)
{
    const [round, setRound] = useState<number>();
    const [turn, setTurn] = useState<number>();
    const [players, setPlayers] = useState <IPlayerData>();
    if(connection)
    {
        connection.on("match-players", (_players) => 
        {
            setPlayers(_players);
            connection.on("match-round", (data) => setRound(data));
            connection.on("match-turn", (data) => setTurn(data));
        })
    }
    return (
    <section className="flex flex-col h-full w-full min-w-[200px] max-w-[400px] gap-4">
        <SpecsUser />
        <PlayersState players={players} round={round} turn={turn} />
        <InventoryState />
        {/* <ModalPergunta/> */}
    </section>
    );
}