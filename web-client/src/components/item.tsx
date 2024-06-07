import itemsData from '../assets/data/items.json';
import bomb from "../assets/sprites/bomb.png";
import cancel from "../assets/sprites/cancel.png";
import shield from "../assets/sprites/shield.png";
import ticket from "../assets/sprites/ticket.png";

const icons = [
    ticket,
    shield,
    cancel,
    bomb,
];

export function Item ({itemID, textClass} : {itemID : number, textClass? : string})
{
    const itemData = itemsData[itemID];
    return (
    <span className='flex items-center' title={itemData.description}>
        <img className={`h-8 w-8 object-contain`} src={icons[itemData.id]} />
        <span className={`pl-2 ${textClass?textClass:''}`}>{itemData.name}</span>
    </span>
    );
}