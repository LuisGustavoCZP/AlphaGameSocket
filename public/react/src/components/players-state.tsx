import { useContext, useEffect, useMemo, useState } from "react"
import { IPlayerData } from "../game/player";
import charactersData from "../assets/data/characters.json"

export interface IPlayerStateProps 
{
    round? : number,
    turn? : number,
    players? : IPlayerData[]
}

export function PlayersState ({round, turn, players} : IPlayerStateProps)
{
    const playerTurnClass = 'text-[2em] '; //border-2 border-black
    const playerSelfClass = 'text-gray-100 ';

    function renderPlayers ()
    {
        return players?.map((player, index) => 
        {
            const turnClass = turn == index ? playerTurnClass : '';
            const selfClass = player.isPlayer? playerSelfClass: '';
            return (
                <li className={selfClass+"flex justify-between pl-2 pr-2 items-center"}>
                    <img src={charactersData[player.character].portait}/>
                    <span className={turnClass}>{player.name}</span>
                    <span>{player.points}P</span>
                </li>
            );
        }); 
    }

    if(round == undefined|| turn == undefined || players == undefined){
        return <> </>
    }

    return (
        <div>
            <div className="w-full bg-[#343434] flex items-center justify-between p-2">
                <p className="text-[16px]">Jogadores</p><p className="text-[14px]">Round {round}/20</p>
            </div>
            <ul className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-1 box-border text-black text-[12px]">
                <li className="flex justify-between pl-2 pr-3 items-center m-1">
                    <span>Username</span><span>Pontuação</span>
                </li>
                {renderPlayers ()}
            </ul>
        </div>
    )
}