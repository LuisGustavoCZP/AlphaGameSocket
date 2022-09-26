import itemsData from '../assets/data/items.json';

export function Item ({itemID} : {itemID : number})
{
    const itemData = itemsData[itemID];
    return (
    <span className='flex items-center' title={itemData.description}>
        <img className='h-[32px]' src={itemData.icon} />
        <span>{itemData.name}</span>
    </span>
    );
}