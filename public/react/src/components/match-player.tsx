import { ReactNode } from "react";
import charactersData from "../assets/data/characters.json"
import randomCharacter from "../assets/personagens/random.png";

export function MatchPlayer ({index, player, isSelf, isReady, nextChar, backChar, setReady} : any)
{  
    if(player)
    {
        const character = player.character >= 0?charactersData[player.character]:null;
        const playerImg = <img src={character?.portait || randomCharacter} alt="" className=" w-20 h-20" />;

        function charSelection (children : ReactNode)
        {
            if(!isSelf) return children;
            return (
                <span className="flex">
                    <button className="w-fit h-fit p-0 bg-transparent text-[#ffffffde]" onClick={backChar}>{'<'}</button>
                    {children}
                    <button className="w-fit h-fit p-0 bg-transparent text-[#ffffffde]" onClick={nextChar}>{'>'}</button>
                </span>
            );
        }

        function readyElement ()
        {
            const buttonClass   = "select-none text-[#ffffffde] outline outline-1 outline-[#ffffffde] hover:outline-[#000000] hover:text-[#0000000]";
            const spanClass     = "py-2 px-4 select-none cursor-default";
            const redColor      = "bg-[hsl(0,54%,53%)]";
            const greenColor    = "bg-[hsl(120,37%,46%)]";

            if(isSelf)
            {
                if(isReady) return <button className={`${redColor} ${buttonClass}`} onClick={()=>{setReady(false)}}>Esperar</button>;
                else        return <button className={`${greenColor} ${buttonClass}`} onClick={()=>{setReady(true)}}>Iniciar</button>;
            }
            else 
            {
                if(isReady) return <span className={`${greenColor} ${spanClass}`}>Pronto!</span>
                else        return <span className={`${redColor} ${spanClass}`}>Preparando</span>
            }
        }

        return (
            <li className="w-2/5 h-2/5 bg-[#343434] flex flex-col justify-center items-center content-center gap-3 ">
                <span>{player.name}</span>
                {charSelection (playerImg)}
                <span>{character?.name || "Random"}</span>
                {readyElement()}
            </li>
        )
    }else{
        return (
            <li className="w-2/5 h-2/5 bg-[#343434] flex justify-center items-center content-center ">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M90 0H110V200H90V0Z" fill="#D9D9D9"/>
                <rect y="90" width="200" height="20" fill="#D9D9D9"/>
                </svg>
            </li>
        )
    }

}