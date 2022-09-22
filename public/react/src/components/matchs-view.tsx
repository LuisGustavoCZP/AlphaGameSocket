import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';

import { useContext, useEffect, useState } from "react"

export function MatchsView()
{
    //const navigate = useNavigate()
    const [allRooms,setRooms] = useState([<li key={0} className='w-full bg-[#3E3E3E] px-6'>Partidas Criadas</li>])
    const [roomsNames,setRoomsnames]= useState([{"name":'cabeçalho',"players":0,"id":0}])

    function singleRoom(roomName:any){
        return (<li className='flex justify-between px-4 bg-[#3E3E3E]' key={roomName[roomName.length-1].id}>
            <div className='flex flex-col'><span>Nome</span><span>{roomName[roomName.length-1].name}</span></div>
            <div className='flex flex-col'><span>Jogadores</span><span>{roomName[roomName.length-1].players}/4</span>
            </div><button onClick={()=>{/* navigate('/room') */}}>Entrar</button></li>)
    }

    function createRoom(){
        let rooms = allRooms
        let roomName = roomsNames
        roomName.push({"name":`Partida ${allRooms.length-1}`,"players":1,"id":allRooms.length})
        rooms.push(singleRoom(roomName))
        setRoomsnames(roomName)
        setRooms(rooms.map((e)=>e))
        console.log(rooms,roomsNames)
    }

    

    return(<div className='w-2/3 h-full flex flex-col overflow-y-scroll px-4 justify-between'>
        <ul className='w-full flex flex-col gap-2'>{allRooms}</ul>
        <button className='self-end justify-self-end' onClick={()=>{createRoom()}}>Criar sala </button>
    </div>)
}