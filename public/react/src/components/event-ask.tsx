import questions from '../assets/questions/questions.json';
import { EventModal, IEventProps } from './event-modal';

interface IEventAskProps extends IEventProps
{
    questionNumber:number
    finalTime:number,
    choose: (option?:number)=>void
};

export function EventAsk({questionNumber, finalTime, choose} : IEventAskProps)
{
    const question = questions[questionNumber];
    const btnAwnserClass = 'bg-[#7A7A7A] border-2 border-black leading-[35px] text-[25px] text-white w-full cursor-pointer hover:text-[#7A7A7A] hover:bg-white hover:border-white ';
    
    function sendAwnser(choosenAwnser:number)
    {
        choose(choosenAwnser)
    }

    return (
        <EventModal title='Pergunta' finalTime={finalTime} choose={choose}>
            <div className="flex justify-between pl-6 pr-6 w-full text-black text-[36px] leading-[80px]">
                <p>{question.question} </p>
            </div>
            <ul className="text-black leading-[50px] self-start pl-10 w-full flex flex-col justify-center px-8 items-center">
                <li><input type="button" className={btnAwnserClass} id="resposta1" onClick={()=>{sendAwnser(question.answer1.respostaId)}} value={question.answer1.resposta}/></li>
                <li><input type="button" className={btnAwnserClass} id="resposta2" onClick={()=>{sendAwnser(question.answer2.respostaId)}} value={question.answer2.resposta}/></li>
                <li><input type="button" className={btnAwnserClass} id="resposta3" onClick={()=>{sendAwnser(question.answer3.respostaId)}} value={question.answer3.resposta}/></li>
                <li><input type="button" className={btnAwnserClass} id="resposta4" onClick={()=>{sendAwnser(question.answer4.respostaId)}} value={question.answer4.resposta}/></li>
            </ul>
        </EventModal>
    );
}