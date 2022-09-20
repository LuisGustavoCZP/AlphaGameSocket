import { useEffect, useState } from "react";
import itemsData from '../assets/data/items.json';
import { Connection } from "../connection";
import { IItemData } from "../models";

type InventoryStateProps = {
    items:IItemData[]
}

export function InventoryState ({items} : InventoryStateProps)
{   
    function generateItems ()
    {
        return itemsData.map((itemData, index) => 
        {
            const quanty = items[index]?.quanty || 0;
            const itemClass = quanty ? '' : 'text-[#484848] '
            return (
                <li key={index} className={itemClass + "flex justify-between pl-2 pr-3 items-center cursor-default select-none"} title={itemData.description}>
                    <span>
                        <img src={itemData.icon} />
                        <span>{itemData.name}</span>
                    </span>
                    <span>{quanty}</span>
                </li>
            );
        })
    }

    useEffect(() => 
    {
        
        //isItemNone ();
    }, []);

    return <div>
        <div className="w-full bg-[#343434] flex items-center justify-between p-2"><p className="text-[16px]">Inventário</p></div>
            <ul className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-1 box-border text-black text-[12px]">
                <li className="flex justify-between pl-2 pr-3 items-center m-1"><span>Item</span><span>Quantidade</span></li>
                {generateItems ()}
            </ul>
    </div>;
}