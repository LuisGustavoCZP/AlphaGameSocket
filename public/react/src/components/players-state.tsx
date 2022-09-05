import { useContext, useEffect, useMemo, useState } from "react"
import { IPlayerData } from "../game/player";

export interface IPlayerStateProps 
{
    round? : number,
    turn? : number,
    players? : IPlayerData
}

export function PlayersState ({round, turn, players} : IPlayerStateProps)
{
    const [turno, setTurno] = useState(0);
    const [pontos, setPontos] = useState([0,3000,200,500])
    const [playerTurn, setTurn] = useState([' ',' ',' ',' '])
    const playerTurnClass = 'border-2 border-black '
    function isPlayerTurn(myTurn: string){
        let arr = Array(4)
        if(myTurn == '1'){
            arr = [playerTurnClass,' ',' ',' ']
        }else if(myTurn == '2'){
            arr = [' ',playerTurnClass,' ',' ']
        }else if(myTurn == '3'){
            arr = [' ',' ',playerTurnClass,' ']
        }else if(myTurn == '4'){
            arr = [' ',' ',' ',playerTurnClass]
        }
        setTurn(arr)
    }
    useEffect(() => 
    {
        isPlayerTurn ('1');
    }, []);

    return (
        <div>
            <div className="w-full bg-[#343434] flex items-center justify-between p-4"><p className="text-[28px]">Jogadores</p><p className="text-[20px]">Turno {turno}/10</p></div>
            <ul className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-2 box-border text-black">
                <li className="flex justify-between pl-2 pr-3 items-center m-2"><span>Username</span><span>Pontuação</span></li>
                <li className={playerTurn[0]+"flex justify-between pl-2 pr-2 items-center m-1"}><span>Jogador 1</span><span>{pontos[0]}P</span></li>
                <li className={playerTurn[1]+"flex justify-between pl-2 pr-2 items-center m-1"}><span >Jogador 2</span><span >{pontos[1]}P</span ></li>
                <li className={playerTurn[2]+"flex justify-between pl-2 pr-2 items-center m-1"}><span>Jogador 3</span><span>{pontos[2]}P</span></li>
                <li className={playerTurn[3]+"flex justify-between pl-2 pr-2 items-center m-1"}><span>Jogador 4</span><span>{pontos[3]}P</span></li>
            </ul>
        </div>
    )
}