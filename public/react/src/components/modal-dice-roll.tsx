import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import itemsName from '../assets/data/items.json'
import { waitTime } from "../game/utils/wait";
import {DiceRoll} from './dice-animation'
type modalDiceRollType = {
    finalTime:number,
    choose: (option?:number)=>void
}

export default function ModalDiceRoll({finalTime, choose}:modalDiceRollType){
    const [totalTime, setTotalTime] = useState(60);
    const [timeLeft, timeHandler] = useState(totalTime)
    const [modalContent,setModalContent] = useState(<div></div>)
    const btnAwnserClass = 'bg-[#7A7A7A] border-2 border-black leading-[35px] text-[25px] text-white w-full cursor-pointer hover:text-[#7A7A7A] hover:bg-white hover:border-white '
    function tick(){
        const timeLeft = Math.max(0, finalTime - Date.now());
        timeHandler(timeLeft);
        if(timeLeft <= 0) 
        {
            // Funçao de fechar o modal automaticamente e passar a vez vem aqui TODO
            choose();
        }
    }
    async function rollTheDice()
    {
        // Funçao de jogar o dado e andar vem aqui TODO
        setModalContent(<DiceRoll diceNumber={1}></DiceRoll>)
        choose(-1);
    }

    function chooseTheItem(){
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
    function useItem(itemNumber:number){
        // funçao de usar o item e jogar o dado vem aqui TODO
        choose(itemNumber);
    }
    useEffect(()=>{
        setModalContent(        
        <div className="flex flex-col justify-center items-center w-full gap-8">
            <input type="button" className={btnAwnserClass} id="resposta1" onClick={()=>{rollTheDice()}} value="Jogar o dado"/>
            <input type="button" className={btnAwnserClass} id="resposta2" onClick={()=>{chooseTheItem()}} value="Utilizar item"/>
        </div>)
    })

    useEffect(()=>{
        setTotalTime(finalTime - Date.now());
        const interval = setInterval(()=>{
            tick()
        }, 500);
        return ()=>clearInterval(interval)

    },[])
    return(
    <div className="flex bg-[#00000099] items-center justify-center w-screen h-screen fixed m-0 ">
        <div className="h-3/4 w-4/5 bg-[#D9D9D9] relative flex flex-col content-center items-center transform transition-all ">
        <div className="w-full text-[58px] bg-[#3E3E3E] pl-10 leading-[80px] flex justify-between">
                <h2 >Sua vez</h2>
                <div className='w-20 h-20'>
                    <CircularProgressbar value={(timeLeft/totalTime)*100} text={`${Math.floor(timeLeft/1000)}s`}  styles={buildStyles({
                        // Rotation of path and trail, in number of turns (0-1)
                        rotation: 1,

                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                        strokeLinecap: 'round',

                        // Text size
                        textSize: '16px',

                        // How long animation takes to go from one percentage to another, in seconds
                        pathTransitionDuration: 0.5,

                        // Can specify path transition in more detail, or remove it entirely
                        // pathTransition: 'none',

                        // Colors
                        pathColor: `#e2e2e2`,
                        textColor: '#e2e2e2',
                        trailColor: '#757575',
                        backgroundColor: '#3e98c7',
                    })}/>
                </div>
            </div>
            {modalContent}
        </div>
    </div>)
}