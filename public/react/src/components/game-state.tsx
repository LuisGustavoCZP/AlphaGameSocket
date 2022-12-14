import { useEffect, useState, useContext } from "react";

import { InventoryState } from "./inventory-state";
import { PlayersState } from "./players-state";
import { SpecsUser } from "./specsuser";
import { IGameProps } from "./game-room";
import { IPlayerData } from "../game/player";
import { PlayerContext } from "../contexts";

import { EventAsk } from "./event-ask";
import { EventTurn } from "./event-turn";
import { EventDice } from "./event-dice";
import { waitTime } from "../utils/wait";
import { EventItem } from "./event-item";
import { IItemData } from "../models";
import { EventPass } from "./event-pass";
import { EventSafe } from "./event-safe";
import { EndGameModal } from "./endgame-modal";
import { masterAudio } from "./audiocontrol";
import { EventTrap } from "./event-trap";

export function GameState ({connection} : IGameProps)
{
    const [round, setRound] = useState<number>();
    const [turn, setTurn] = useState<number>();
    const [players, setPlayers] = useState <IPlayerData[]>();
    const [getItems, setitems] = useState<IItemData[]>([]);
    const [modal, setModal] = useState(<></>);
    const {getUserData} = useContext(PlayerContext);
    function openModal(eventID : number, finalTime : number, data? : any)
    {
        if(eventID == -2) setModal(<EventDice finalTime={Date.now()+finalTime} choose={chooseAction} connection={data} />);
        else if(eventID == -4) setModal(<EventSafe finalTime={Date.now()+finalTime} choose={chooseAction} items={data} />);
        else if(eventID == -3) setModal(<EventItem finalTime={Date.now()+finalTime} choose={chooseAction} items={data} />);
        else if(eventID == -1) setModal(<EventTurn finalTime={Date.now()+finalTime} choose={chooseAction} items={data} />);
        else if(eventID == 0) setModal(<EventAsk finalTime={Date.now()+finalTime} choose={chooseAction} questionNumber={data!} />);
        else if(eventID == 1) setModal(<EventPass finalTime={Date.now()+finalTime} choose={chooseAction} />);
        else if(eventID == 2) setModal(<EventPass finalTime={Date.now()+finalTime} choose={chooseAction} />);
        else if(eventID == 3) setModal(<EventTrap finalTime={Date.now()+finalTime} choose={chooseAction} />);
    }
    function closeModal()
    {
        setModal(<></>);
    }

    function chooseAction(option? : number)
    {
        closeModal();
        if(option != null && option != undefined)
        {
            connection.send("execute-event", option);
        }
    }

    function network ()
    {
        console.log("Game Conectando...");
        if(connection)
        {
            console.log("Game Conectado!");
            connection.on("match-players", (_players) => 
            {
                setPlayers(_players);
                connection.on("match-round", (data) => setRound(data));
                connection.on("match-turn", (data) => setTurn(data));
                
                connection.on("preparing-turn", () => 
                {
                    connection.off("starting-turn");
                    connection.off("starting-move");
                    connection.off("finish-move");
                    openModal(-2, 0, connection)
                });

                connection.on("player-items", ({items}) => 
                {
                    setitems(items);
                });

                connection.on("next-turn", ({turn, round}) => 
                {
                    setRound(round);
                    setTurn(turn);
                    setPlayers(_players);
                    console.log("aqui felipe",_players)
                    let thisUserTurn = {index:-1}
                    _players.forEach((ele:any)=>{
                        if(ele.name == getUserData.username){
                            thisUserTurn = ele
                        }
                    })
                    console.log(thisUserTurn,turn)
                    if(thisUserTurn.index==turn){
                        console.log('entrou')
                        
                        masterAudio.play('yourturn','./src/assets/sounds/yourturnsound.mp3')
                    }
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
                    } else if (data.event == -1 || data.event == -4)
                    {
                        eventData = data.data;
                    }

                    openModal(data.event, data.limitTime, eventData);

                    connection.on("end-event", (data : {sucess:boolean, items:number[]}) => 
                    {
                        closeModal();
                        connection.off("end-event");
                        if(data.items.length > 0)
                        {
                            openModal(-3, 5000, data.items);
                        }
                    });
                });

                connection.send("match-players", true);
            });
            connection.on("match-result", ({result, players}) => {setModal(<EndGameModal result={result} players={players}/>)});
        }
    }

    useEffect(() => 
    {
        network ();
    }, []);
    
    return (
    <section className="flex flex-col h-full min-w-fit portrait:w-full gap-4 portrait:flex-row">
        <SpecsUser player={getUserData} className="portrait:hidden" inGame={true}/>
        <PlayersState players={players} round={round} turn={turn} />
        <InventoryState items={getItems}/>
        {/* <h1>Voce tirou {diceNumber} no dado</h1> */}
        {modal}
    </section>
    );
}