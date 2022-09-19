import { InventoryState } from "./inventory-state";
import { PlayersState } from "./players-state";
import { SpecsUser } from "./specsuser";
import { ModalPergunta } from './modalpergunta'
import { IGameProps } from "./game-room";
import { useEffect, useState } from "react";
import { IPlayerData } from "../game/player";
import { DiceRoll } from "./dice-animation";
export function GameState ({connection} : IGameProps)
{
    const [round, setRound] = useState<number>();
    const [turn, setTurn] = useState<number>();
    const [diceNumber, setDice ] = useState<number>();
    const [players, setPlayers] = useState <IPlayerData[]>();
    const [modal,setModal] = useState(<></>)

    function openModal(eventID : number, finalTime : number, questionNumber? : number){
        if(eventID == 0) setModal(<ModalPergunta finalTime={finalTime} choose={chooseFunction} questionNumber={questionNumber!} />)
    }
    function closeModal(){
        setModal(<></>)
    }
    function chooseFunction(option? : number){
        closeModal();
        if(option)
        {
            connection.send("execute-event", option);
        }
    }

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
                        //console.log(playerindex)
                        _players![playerindex].points = points;
                        setPlayers(_players);
                        connection.off("finish-move");
                    });
                });

                connection.on("start-event", (data : {event:number, limitTime:number, data?:any}) => 
                {
                    //console.log(data);
                    if(data.event == 0)
                    {
                        const question = data.data as number;
                        openModal(data.event, data.limitTime, question);
                    }

                    connection.on("end-event", (data : {sucess:boolean, items:number[]}) => 
                    {
                        closeModal();
                        connection.off("end-event")
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
        <InventoryState playerItems=/*{variavel dos items vem aqui }*/{[{id:0,quanty:0},{id:1,quanty:0},{id:2,quanty:0},{id:3,quanty:0},{id:4,quanty:0},{id:5,quanty:0}]}/>
        <DiceRoll diceNumber={diceNumber} />
        <h1>Voce tirou {diceNumber} no dado</h1>
        {modal}
    </section>
    );
}