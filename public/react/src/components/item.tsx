import itemsData from '../assets/data/items.json';

export function Item ({itemID} : {itemID : number})
{
    const itemData = itemsData[itemID];
    return (
    <span title={itemData.description}>
        <img src={itemData.icon} />
        <span>{itemData.name}</span>
    </span>
    );
}