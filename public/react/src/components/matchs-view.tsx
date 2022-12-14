import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';

import { ReactNode, useContext, useEffect, useState } from "react"
import { PlayerContext } from '../contexts';
import { MatchData } from '../models';

export function MatchsView()
{
    const { connection, setMatchID, getPage } = useContext(PlayerContext);
    const [allRooms, setRooms] = useState<MatchData[]>([])
    //const [roomsNames, setRoomsnames]= useState([{"name":'cabeçalho',"players":0,"id":0}])

    function singleRoom(index : number, room : MatchData){
        return (
        <li className='flex justify-between px-4 bg-[#3E3E3E]' key={room.id}>
            <div className='flex flex-col'><span>Nome</span><span>{room.name}</span></div>
            <div className='flex flex-col'><span>Jogadores</span><span>{room.count}/{room.max}</span></div>
            <button className="disabled:bg-[#8b8b8b] disabled:cursor-default" onClick={()=>{enterRoom(room.id)}} disabled={room.full} >Entrar</button>
        </li>
        );
    }

    function renderRooms()
    {
        return allRooms.map((room, index) => singleRoom(index, room));
    }

    function createRoom ()
    {
        console.log("Clicando botão partida");
        connection.send("match-new", true);
    }

    function enterRoom (roomID : string)
    {
        connection.off("matchs");
        connection.send("match-enter", roomID);
    }

    useEffect(() => 
    {
        connection.on("match-enter", (matchid) => 
        {
            console.log(matchid);
            setMatchID(matchid);
            connection.off("match-enter");
        });

        connection.on("matchs", (data : MatchData[]) => 
        {
            setRooms(data);
        });
    }, [connection]);

    return (
        <div className='w-full h-full flex flex-col flex-grow content-start place-self-start'>
            <span className='flex w-full bg-[#3E3E3E] p-2 justify-between items-center'>
                <h2 className='px-4 text-[24px]'>Partidas Criadas</h2>
                <button className='self-end justify-self-end text-[14px]' onClick={()=>{createRoom()}}>Criar sala</button>
            </span>
            <div className='flex overflow-y-scroll h-full py-2 px-4'>
                <ul className='w-full flex flex-col gap-2'>
                    {renderRooms()}
                </ul>
            </div>
        </div>
    );
}