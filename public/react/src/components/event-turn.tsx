import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { EventModal, IEventProps } from './event-modal';
import { DiceRoll } from './dice-animation';
import itemsName from '../assets/data/items.json';

export function EventTurn({finalTime, choose} : IEventProps)
{
    const [modalContent, setModalContent] = useState(<div></div>)
    const btnAwnserClass = 'bg-[#7A7A7A] border-2 border-black leading-[35px] text-[25px] text-white w-full cursor-pointer hover:text-[#7A7A7A] hover:bg-white hover:border-white '
   
    async function rollTheDice()
    {
        // Funçao de jogar o dado e andar vem aqui TODO
        setModalContent(<DiceRoll diceNumber={1}></DiceRoll>)
        choose(-1);
    }

    function chooseTheItem()
    {
        const playerItems = [{id:0,quanty:1},{id:1,quanty:0},{id:2,quanty:1},{id:3,quanty:0},{id:4,quanty:0},{id:5,quanty:0}] //mock data
        const renderUsableItems:any = []
        playerItems.forEach(ele=>{
            if(ele.quanty>0){
                renderUsableItems.push(<li className={btnAwnserClass} onClick={()=>{useItem(ele.id)}}>{itemsName[ele.id].name}</li>)
            }
        })
        renderUsableItems.push(<li className={btnAwnserClass} onClick={()=>{
            setModalContent(        
                <div className="flex flex-col justify-center items-center w-full gap-8">
                    <input type="button" className={btnAwnserClass} id="resposta1" onClick={()=>{rollTheDice()}} value="Jogar o dado"/>
                    <input type="button" className={btnAwnserClass} id="resposta2" onClick={()=>{chooseTheItem()}} value="Utilizar item"/>
                </div>)
        }}>Voltar</li>)
        setModalContent(<ul className="flex flex-col justify-center items-center w-full gap-2">
            {renderUsableItems}
        </ul>)
    }

    function useItem(itemNumber:number)
    {
        // funçao de usar o item e jogar o dado vem aqui TODO
        choose(itemNumber);
    }

    useEffect(()=>
    {
        setModalContent(        
        <div className="flex flex-col justify-center items-center w-full gap-8">
            <input type="button" className={btnAwnserClass} id="resposta1" onClick={()=>{rollTheDice()}} value="Jogar o dado"/>
            <input type="button" className={btnAwnserClass} id="resposta2" onClick={()=>{chooseTheItem()}} value="Utilizar item"/>
        </div>)
    }, [])

    return (
        <EventModal title='Pergunta' finalTime={finalTime} choose={choose}>
            {modalContent}
        </EventModal>
    );
}