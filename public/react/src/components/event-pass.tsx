import items from '../assets/data/items.json';
import { EventModal, IEventProps } from './event-modal';
import { Item } from './item';

interface IEventPassProps extends IEventProps
{
    finalTime:number,
    choose: (option?:number)=>void
};

export function EventPass({finalTime, choose} : IEventPassProps)
{
    const btnAwnserClass = 'bg-[#7A7A7A] border-2 border-black leading-[20px] text-[14px] text-white w-full cursor-pointer hover:text-[#7A7A7A] hover:bg-white hover:border-white ';
    
    function sendAwnser(choosenAwnser:number)
    {
        choose(choosenAwnser)
    }

    return (
        <EventModal title='Pergunta' finalTime={finalTime} choose={choose} className='h-2/6 w-2/5 min-h-fit min-w-fit'>
            <div className="flex justify-between pl-6 pr-6 w-full text-black text-[24px] leading-[60px]">
                <p>Deseja se arriscar pelo caminho tortuoso? Isso custará 1 dos seus <Item itemID={0}/></p>
            </div>
            <ul className="text-black leading-[30px] self-start pl-10 w-full flex flex-col justify-center px-8 items-center">
                <li><button className={btnAwnserClass} onClick={()=>{sendAwnser(0)}}>Continuar em segurança</button></li>
                <li><button className={btnAwnserClass} onClick={()=>{sendAwnser(1)}}>Se arriscar</button></li>
            </ul>
        </EventModal>
    );
}