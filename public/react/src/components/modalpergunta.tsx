import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import questions from '../assets/questions/questions.json';
type modalPerguntaType={
    questionNumber:number
    finalTime:number,
    choose: (option?:number)=>void
}

export function ModalPergunta({questionNumber,finalTime,choose}:modalPerguntaType){
    const question = questions[questionNumber]
    const [totalTime, setTotalTime] = useState(60);
    const [timeLeft, timeHandler] = useState(totalTime)
    const timeLeftRef = useRef(timeLeft)
    function tick(){
        const timeLeft = Math.max(0, finalTime - Date.now());
        timeHandler(timeLeft);
        if(timeLeft <= 0) 
        {
            choose();
        }
    }
    useEffect(()=>{
        setTotalTime(finalTime - Date.now());
        console.log('entrou')
        const interval = setInterval(()=>{
            console.log(timeLeftRef.current)
            tick()
        }, 500);
        return ()=>clearInterval(interval)

    },[])
    
    return<div className="flex bg-[#00000099] items-center justify-center w-screen h-screen fixed m-0">
        <div className="h-3/4 w-4/5 bg-[#D9D9D9] relative flex flex-col content-start items-center">
            <div className="w-full text-[58px] bg-[#3E3E3E] pl-10 leading-[80px] flex justify-between">
                <h2 >Pergunta</h2>
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
            <div className="flex justify-between pl-6 pr-6 w-full text-black text-[36px] leading-[80px]">
                <p>{question.question} </p>
                
            </div>
            <ul className="text-black leading-[50px] self-start pl-10">
                <li><input type="radio" name="resposta" id="resposta1" value={question.answer1.respostaId}/> <label htmlFor="resposta1">{question.answer1.resposta}</label></li>
                <li><input type="radio" name="resposta" id="resposta2" value={question.answer2.respostaId}/> <label htmlFor="resposta2">{question.answer2.resposta}</label></li>
                <li><input type="radio" name="resposta" id="resposta3" value={question.answer3.respostaId}/> <label htmlFor="resposta3">{question.answer3.resposta}</label></li>
                <li><input type="radio" name="resposta" id="resposta4" value={question.answer4.respostaId}/> <label htmlFor="resposta4">{question.answer4.resposta}</label></li>
            </ul>
            <button className="bg-[#7A7A7A]  border-2 border-black leading-[50px] text-[40px] text-black absolute bottom-5" type="button">Enviar</button>
        </div>
    </div>
}