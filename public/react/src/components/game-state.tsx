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
    const [diceNumber, setDice ] = useState<number>();
    const [players, setPlayers] = useState <IPlayerData[]>();
    if(connection)
    {
        connection.on("match-players", (_players) => 
        {
            setPlayers(_players);
            connection.on("match-round", (data) => setRound(data));
            connection.on("match-turn", (data) => setTurn(data));
            connection.send("match-players", true);
        })
        connection.on("starting-move",(data)=> {
            setDice(data.move);
            console.log(data.move) })
        connection.on("finish-move",(data)=> {
            
            setRound(data.round);
            setTurn(data.turn);
        } )
    }
    return (
    <section className="flex flex-col h-full w-full min-w-[200px] max-w-[400px] gap-4">
        <SpecsUser players={players}/>
        <PlayersState players={players} round={round} turn={turn} />
        <InventoryState />
        <h1>Voce tirou {diceNumber} no dado</h1>
        {/* <ModalPergunta/> */}
    </section>
    );
}