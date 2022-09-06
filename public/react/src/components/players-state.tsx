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
    
    if(round == undefined|| turn == undefined || players == undefined){
        return <> </>
    }

    isPlayerTurn(turn)
    return (
        <div>
            <div className="w-full bg-[#343434] flex items-center justify-between p-4"><p className="text-[28px]">Jogadores</p><p className="text-[20px]">Round {round}/20</p></div>
            <ul className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-2 box-border text-black">
                <li className="flex justify-between pl-2 pr-3 items-center m-2"><span>Username</span><span>Pontuação</span></li>
                <li className={playerTurn[0]+"flex justify-between pl-2 pr-2 items-center m-1"}><span>{players[0].name}</span><span>{players[0].points}P</span></li>
                <li className={playerTurn[1]+"flex justify-between pl-2 pr-2 items-center m-1"}><span >{players[1].name}</span><span >{players[1].points}P</span ></li>
                <li className={playerTurn[2]+"flex justify-between pl-2 pr-2 items-center m-1"}><span>{players[2].name}</span><span>{players[2].points}P</span></li>
                <li className={playerTurn[3]+"flex justify-between pl-2 pr-2 items-center m-1"}><span>{players[3].name}</span><span>{players[3].points}P</span></li>
            </ul>
        </div>
    )
}