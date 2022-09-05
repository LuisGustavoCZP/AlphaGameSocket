import { InventoryState } from "./inventory-state";
import { PlayersState } from "./players-state";
import { SpecsUser } from "./specsuser";
import { ModalPergunta } from './modalpergunta'
import { IGameProps } from "./game-room";
import { useEffect, useState } from "react";
import { IPlayerData } from "../game/player";

export function GameState ({connection} : IGameProps)
{
    const [round, setRound] = useState<number>();
    const [turn, setTurn] = useState<number>();
    const [diceNumber, setDice ] = useState<number>();
    const [players, setPlayers] = useState <IPlayerData[]>();
    
    useEffect(() => 
    {
        if(connection)
        {
            connection.on("match-players", (_players) => 
            {
                setPlayers(_players);
                connection.on("match-round", (data) => setRound(data));
                connection.on("match-turn", (data) => setTurn(data));
                
                connection.on("starting-move", ({playerindex, move}) => 
                {
                    setDice(move);

                    connection.on("finish-move", ({turn, round, points, items})=> 
                    {
                        setRound(round);
                        setTurn(turn);
                        console.log(playerindex)
                        _players![playerindex].points = points;
                        setPlayers(_players);
                        connection.off("finish-move");
                    });
                });
                connection.send("match-players", true);
            });
        }
    }, [connection])
    
        
    
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