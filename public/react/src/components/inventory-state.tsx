import { useEffect, useState } from "react";
import itemsData from '../assets/data/items.json';
import { IItemData } from "../models";

type InventoryStateProps = {
    playerItems:IItemData[]
}

export function InventoryState ({playerItems} : InventoryStateProps)
{   
    const [items, setitems] = useState(playerItems)
    /* const [noitems,setitemsclass] = useState([' ',' ',' ',' ',' ',' '])
    const noItemsClass = 'text-[#484848]'
    function isItemNone()
    {
        let arr = Array(5)
        items.forEach((e:any,i:any)=>{
            if(e.quanty==0){
                arr[i] ='text-[#484848]'
            }else{
                
                arr[i] = ' '
            }
        })
        setitemsclass(arr)
    } */

    function generateItems ()
    {
        return itemsData.map((itemData, index) => 
        {
            const quanty = items[index]?.quanty || 0;
            const itemClass = quanty ? '' : 'text-[#484848] '
            return (
                <li key={index} className={itemClass + "flex justify-between pl-2 pr-3 items-center"}>
                    <span>
                        <img src={itemData.icon} />
                        <span title={itemData.description}>{itemData.name}</span>
                    </span>
                    <span>{quanty}</span>
                </li>
            );
        })
    }

    useEffect(() => 
    {
        setitems(playerItems);
        //isItemNone ();
    }, [playerItems]);

    return <div>
        <div className="w-full bg-[#343434] flex items-center justify-between p-2"><p className="text-[16px]">Inventário</p></div>
            <ul className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-1 box-border text-black text-[12px]">
                <li className="flex justify-between pl-2 pr-3 items-center m-1"><span>Item</span><span>Quantidade</span></li>
                {generateItems ()}
                {/* <li className={noitems[0]+" flex justify-between pl-2 pr-3 items-center"}><span>Relógio adiantado</span><span>{items[0].quanty}</span></li>
                <li className={noitems[1]+" flex justify-between pl-2 pr-3 items-center"}><span>Bomba</span><span>{items[1].quanty}</span></li>
                <li className={noitems[2]+" flex justify-between pl-2 pr-3 items-center"}><span>Relógio atrasado</span><span>{items[2].quanty}</span></li>
                <li className={noitems[3]+" flex justify-between pl-2 pr-3 items-center"}><span>Relógio Mestre</span><span>{items[3].quanty}</span></li>
                <li className={noitems[4]+" flex justify-between pl-2 pr-3 items-center"}><span>Dados duplos</span><span>{items[4].quanty}</span></li>
                <li className={noitems[5]+" flex justify-between pl-2 pr-3 items-center"}><span>Passe para os Caminhos Tortuosos</span><span>{items[5].quanty}</span></li> */}
            </ul>
    </div>;
}