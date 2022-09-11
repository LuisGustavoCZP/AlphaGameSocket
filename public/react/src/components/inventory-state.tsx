import { useEffect, useState } from "react";

export function InventoryState (props : any)
{   
    const [items,setitems] = useState([0,2,3,0,1])
    const [noitems,setitemsclass] = useState([' ',' ',' ',' ',' '])
    const noItemsClass = 'text-[#484848]'
    function isItemNone(){
        let arr = Array(5)
        items.forEach((e,i)=>{
            if(e==0){
                arr[i] ='text-[#484848]'
            }else{
                
                arr[i] = ' '
            }
        })
        setitemsclass(arr)
    }
    useEffect(() => 
    {
        isItemNone ();
    }, []);
    return <div>
        <div className="w-full bg-[#343434] flex items-center justify-between p-2"><p className="text-[16px]">Inventário</p></div>
            <ul className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-1 box-border text-black text-[12px]">
                <li className="flex justify-between pl-2 pr-3 items-center m-1"><span>Item</span><span>Quantidade</span></li>
                <li className={noitems[0]+" flex justify-between pl-2 pr-3 items-center"}><span>Chance extra</span><span>{items[0]}</span></li>
                <li className={noitems[1]+" flex justify-between pl-2 pr-3 items-center"}><span>Nova pergunta</span><span>{items[1]}</span></li>
                <li className={noitems[2]+" flex justify-between pl-2 pr-3 items-center"}><span>Mais tempo</span><span>{items[2]}</span></li>
                <li className={noitems[3]+" flex justify-between pl-2 pr-3 items-center"}><span>Dados duplos</span><span>{items[3]}</span></li>
                <li className={noitems[4]+" flex justify-between pl-2 pr-3 items-center"}><span>Passe para os Caminhos Tortuosos</span><span>{items[4]}</span></li>
            </ul>
    </div>;
}