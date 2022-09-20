import questions from '../assets/questions/questions.json';
import { EventModal, IEventProps } from './event-modal';
import { DiceRoll } from './dice-animation';
import { Connection } from '../connection';
import { useEffect, useState } from 'react';
import { waitTime } from '../utils/wait';

interface IEventDiceProps extends IEventProps
{
    connection:Connection
    finalTime:number,
    choose: (option?:number)=>void
};

export function EventDice({connection, finalTime, choose} : IEventDiceProps)
{
    const [diceNumber, setDice ] = useState<number>();
    const [roll, setRoll] = useState<boolean>(true);

    function loop ()
    {
        if(roll) return;
        setDice(Math.ceil(Math.random()*6));
        setTimeout(loop, 500)
    }

    useEffect(()=>
    {
        loop ();

        
        connection.on("starting-move", async ({ move }) => 
        {
            connection.off("starting-move");
            choose();
        });

        connection.on("starting-turn", async ({ move }) => 
        {
            connection.off("starting-turn");
            setRoll(false);
            setDice(move);
        });

        connection.on("finish-move", ()=> 
        {
            connection.off("finish-move");
        });

    }, [])

    return (
        <EventModal title='Jogando dado'>
            <DiceRoll diceNumber={diceNumber}></DiceRoll>
        </EventModal>
    );
}