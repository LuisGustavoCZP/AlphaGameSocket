import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';

import { ReactNode, useContext, useEffect, useState } from "react"
import { PlayerContext } from '../contexts';

export function MatchsView()
{
    const { connection, setMatchID } = useContext(PlayerContext);
    const [allRooms,setRooms] = useState<ReactNode[]>([])
    const [roomsNames,setRoomsnames]= useState([{"name":'cabeçalho',"players":0,"id":0}])

    function singleRoom(roomName:any){
        return (<li className='flex justify-between px-4 bg-[#3E3E3E]' key={roomName[roomName.length-1].id}>
            <div className='flex flex-col'><span>Nome</span><span>{roomName[roomName.length-1].name}</span></div>
            <div className='flex flex-col'><span>Jogadores</span><span>{roomName[roomName.length-1].players}/4</span>
            </div><button onClick={()=>{/* navigate('/room') */}}>Entrar</button></li>)
    }

    function createRooms()
    {
        let rooms = allRooms
        let roomName = roomsNames
        roomName.push({"name":`Partida ${allRooms.length-1}`,"players":1,"id":allRooms.length})
        rooms.push(singleRoom(roomName))
        setRoomsnames(roomName)
        setRooms(rooms.map((e)=>e))
        console.log(rooms,roomsNames)
    }

    function createRoom ()
    {
        console.log("Clicando botão partida");
        connection.send("match-new", true);
    }

    useEffect(() => 
    {
        connection.on("match-enter", (matchid) => 
        {
            console.log(matchid);
            setMatchID(matchid);
        });

        connection.on("matchs", (data) => 
        {

        });
    }, []);

    return (
        <div className='w-2/3 h-full flex flex-col justify-between'>
            <span className='flex w-full bg-[#3E3E3E] p-2 justify-between items-center'>
                <h2 className='px-4 text-[24px]'>Partidas Criadas</h2>
                <button className='self-end justify-self-end text-[14px]' onClick={()=>{createRoom()}}>Criar sala</button>
            </span>
            <div className='flex overflow-y-scroll h-full py-2 px-4'>
                <ul className='w-full flex flex-col gap-2'>{allRooms}</ul>
            </div>
        </div>
    );
}