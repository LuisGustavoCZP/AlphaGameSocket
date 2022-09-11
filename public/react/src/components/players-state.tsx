import { useContext, useEffect, useMemo, useState } from "react"
import { IPlayerData } from "../game/player";

export interface IPlayerStateProps 
{
    round? : number,
    turn? : number,
    players? : IPlayerData[]
}

export function PlayersState ({round, turn, players} : IPlayerStateProps)
{
    console.log('aqui',round,turn,players)
    let playerTurn = [' ',' ',' ',' ']
    const playerTurnClass = 'border-2 border-black '
    function isPlayerTurn(myTurn: number){
        let arr = Array(4)
        if(myTurn == 0){
            arr = [playerTurnClass,' ',' ',' ']
        }else if(myTurn == 1){
            arr = [' ',playerTurnClass,' ',' ']
        }else if(myTurn == 2){
            arr = [' ',' ',playerTurnClass,' ']
        }else if(myTurn == 3){
            arr = [' ',' ',' ',playerTurnClass]
        }
        playerTurn = arr;
    }

    let playerSelfClass = 'text-gray-100 ';
    function isPlayerSelf(players: IPlayerData[])
    {
        return players.map(player => player.isPlayer?playerSelfClass:'');
    }
    
    if(round == undefined|| turn == undefined || players == undefined){
        return <> </>
    }

    const isPlayersClass = isPlayerSelf(players);
    isPlayerTurn(turn);
    return (
        <div>
            <div className="w-full bg-[#343434] flex items-center justify-between p-2"><p className="text-[16px]">Jogadores</p><p className="text-[14px]">Round {round}/20</p></div>
            <ul className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-1 box-border text-black text-[12px]">
                <li className="flex justify-between pl-2 pr-3 items-center m-1"><span>Username</span><span>Pontuação</span></li>
                <li className={playerTurn[0]+isPlayersClass[0]+"flex justify-between pl-2 pr-2 items-center"}><span>{players[0].name}</span><span>{players[0].points}P</span></li>
                <li className={playerTurn[1]+isPlayersClass[1]+"flex justify-between pl-2 pr-2 items-center"}><span>{players[1].name}</span><span >{players[1].points}P</span ></li>
                <li className={playerTurn[2]+isPlayersClass[2]+"flex justify-between pl-2 pr-2 items-center"}><span>{players[2].name}</span><span>{players[2].points}P</span></li>
                <li className={playerTurn[3]+isPlayersClass[3]+"flex justify-between pl-2 pr-2 items-center"}><span>{players[3].name}</span><span>{players[3].points}P</span></li>
            </ul>
        </div>
    )
}