import items from '../assets/data/items.json';
import { IItemData } from '../models';
import { EventModal, IEventProps } from './event-modal';
import { Item } from './item';

interface IEventSafeProps extends IEventProps
{
    finalTime:number,
    choose: (option?:number)=>void,
    items : IItemData[]
};

export function EventSafe({finalTime, choose, items} : IEventSafeProps)
{
    const btnAwnserClass = 'bg-[#7A7A7A] border-2 border-black leading-[20px] text-[14px] text-white w-full cursor-pointer hover:text-[#7A7A7A] hover:bg-white hover:border-white ';
    
    console.log(items);

    function renderItems ()
    {
        return items.map((item, index) => 
        {
            return <li className={btnAwnserClass} onClick={()=>{response(index)}}><Item itemID={item.id}/></li>
        });
    }

    function response (option = -1)
    {
        // funçao de usar o item e jogar o dado vem aqui TODO
        choose(option);
    }

    return (
        <EventModal title='Cuidado!' finalTime={finalTime} choose={choose} className='h-2/6 w-2/4 min-h-fit min-w-fit'>
            <div className="flex justify-between pl-6 pr-6 w-full text-black text-[24px] leading-[60px]">
                <p>O item <Item itemID={0}/> foi usado em você, deseja utilizar um destes items?</p>
            </div>
            <ul className="text-black leading-[30px] self-start pl-10 w-full flex flex-col justify-center px-8 items-center">
                <li className={btnAwnserClass} onClick={()=>{response(-1)}}>Não, aceito minha derrota!</li>
                {renderItems()}
            </ul>
        </EventModal>
    );
}