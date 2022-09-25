import itemsData from '../assets/data/items.json';

export function Item ({itemID} : {itemID : number})
{
    return (
    <span>
        <img src={itemsData[itemID].icon} />
        <span>{itemsData[itemID].name}</span>
    </span>
    );
}