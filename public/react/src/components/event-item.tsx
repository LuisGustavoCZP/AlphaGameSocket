import itemsData from '../assets/data/items.json';
import { IItemData } from '../models';
import { EventModal, IEventProps } from './event-modal';

interface IEventItemProps extends IEventProps
{
    items:IItemData[]
    finalTime:number,
    choose: (option?:number)=>void
};

export function EventItem({items, finalTime, choose} : IEventItemProps)
{
    function generateItems ()
    {
        return items.map((item, index) => 
        {
            const itemData = itemsData[item.id];
            console.log("O item ganho foi", item, itemData)
            return (
                <li key={index} title={itemData.description}>
                    <img src={itemData.icon} />
                    <h4>{itemData.name}</h4>
                </li>
            );
        })
    }

    return (
        <EventModal title='Você acertou!' finalTime={finalTime} choose={choose}>
            <div className="flex justify-between pl-6 pr-6 w-full text-black text-[36px] leading-[80px]">
                <p>Você ganhou items:</p>
            </div>
            <ul className="text-black leading-[50px] self-start pl-10 w-full flex flex-col justify-center px-8 items-center">
                {generateItems ()}
            </ul>
        </EventModal>
    );
}