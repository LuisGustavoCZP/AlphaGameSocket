import { useEffect, useState } from "react";

import { InventoryState } from "./inventory-state";
import { PlayersState } from "./players-state";
import { SpecsUser } from "./specsuser";
import { IGameProps } from "./game-room";
import { IPlayerData } from "../game/player";

import { EventAsk } from "./event-ask";
import { EventTurn } from "./event-turn";
import { EventDice } from "./event-dice";
import { waitTime } from "../utils/wait";
import { EventItem } from "./event-item";

export function GameState ({connection} : IGameProps)
{
    const [round, setRound] = useState<number>();
    const [turn, setTurn] = useState<number>();
    const [players, setPlayers] = useState <IPlayerData[]>();
    const [modal, setModal] = useState(<></>)

    function openModal(eventID : number, finalTime : number, data? : any)
    {
        if(eventID == -2) setModal(<EventDice finalTime={finalTime} choose={chooseAction} connection={data} />);
        else if(eventID == -3) setModal(<EventItem finalTime={finalTime} choose={chooseAction} items={data} />);
        else if(eventID == -1) setModal(<EventTurn finalTime={finalTime} choose={chooseAction} />);
        else if(eventID == 0) setModal(<EventAsk finalTime={finalTime} choose={chooseAction} questionNumber={data!} />);
    }
    function closeModal()
    {
        setModal(<></>)
    }

    function chooseAction(option? : number)
    {
        closeModal();
        if(option)
        {
            connection.send("execute-event", option);
        }
    }

    function network ()
    {
        if(connection)
        {
            connection.on("match-players", (_players) => 
            {
                setPlayers(_players);
                connection.on("match-round", (data) => setRound(data));
                connection.on("match-turn", (data) => setTurn(data));
                
                connection.on("preparing-move", () => 
                {
                    connection.off("starting-move");
                    connection.off("finish-move");
                    openModal(-2, 10000, connection)
                });

                connection.on("next-move", ({turn, round}) => 
                {
                    setRound(round);
                    setTurn(turn);
                    setPlayers(_players);
                });

                connection.on("player-points", ({playerindex, points}) => 
                {
                    _players![playerindex].points = points;
                });

                connection.on("start-event", (data : {event:number, limitTime:number, data?:any}) => 
                {
                    //console.log(data);
                    let eventData : any = null;
                    if(data.event == 0)
                    {
                        eventData = data.data as number;
                    }
                    openModal(data.event, data.limitTime, eventData);

                    connection.on("end-event", (data : {sucess:boolean, items:number[]}) => 
                    {
                        closeModal();
                        if(data.items.length > 0)
                        {
                            openModal(-3, 1000, data.items);
                        }
                        connection.off("end-event");
                    });
                });

                connection.send("match-players", true);
            });
        }
    }

    useEffect(() => 
    {
        network ();
    }, [connection])
    
        
    
    return (
    <section className="flex flex-col h-full w-full min-w-[200px] max-w-[400px] gap-4">
        <SpecsUser players={players}/>
        <PlayersState players={players} round={round} turn={turn} />
        <InventoryState playerItems=/*{variavel dos items vem aqui }*/{[{id:0,quanty:0},{id:1,quanty:0},{id:2,quanty:0},{id:3,quanty:0},{id:4,quanty:0},{id:5,quanty:0}]}/>
        {/* <h1>Voce tirou {diceNumber} no dado</h1> */}
        {modal}
    </section>
    );
}