import { useContext, useEffect, useMemo, useState } from "react"
import { IPlayerData } from "../game/player";
import seta from "../assets/sprites/seta.png"
import { Character } from "./character";

export interface IPlayerStateProps 
{
    round? : number,
    turn? : number,
    players? : IPlayerData[]
}

export function PlayersState ({round, turn, players} : IPlayerStateProps)
{
    const playerTurnClass = 'border-2 border-white ';
    const playerSelfClass = 'text-gray-100 ';
    
    let prob = 1;
    function renderPlayers ()
    {
        let thisPlayer = players!.find(player => player.isPlayer)!;
        return players?.map((player, index) => 
        {
            if(!player.isPlayer && player.points > thisPlayer?.points) prob++;
            const isTurn = turn == index;
            const turnClass = isTurn ? playerTurnClass : '';
            const selfClass = player.isPlayer? playerSelfClass: '';
            return (
                <li className={turnClass+selfClass+"flex justify-between pl-2 pr-2 items-center box-border cursor-default select-none"}>
                    <span className="flex items-center justify-center">
                        <span className="w-6 h-6">
                            {isTurn?(<img className="w-6 h-6 animate-horizontal-bounce" src={seta} alt=">" />):<></>}
                        </span>
                        <Character charID={player.character} size={7}/>
                        <span>{player.name}</span>
                    </span>
                    <span>{player.points}P</span>
                </li>
            );
        }); 
    }

    if(round == undefined|| turn == undefined || players == undefined)
    {
        console.log(`Erro em round:${round}, turno:${turn} ou players:${players?.length}`)
        return <> </>
    }

    const playerRenders = renderPlayers();

    return (
        <div>
            <div className="w-full bg-[#343434] flex items-center justify-between p-2">
                <p className="text-[16px]">Jogadores</p><p className="text-[14px]">{prob}</p>
            </div>
            <ul className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-1 box-border text-black text-[12px]">
                <li className="flex justify-between pl-2 pr-3 items-center m-1">
                    <span>Username</span><span>Pontuação</span>
                </li>
                {playerRenders}
            </ul>
        </div>
    )
}