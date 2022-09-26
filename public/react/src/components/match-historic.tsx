import React, { useEffect, useState, ReactNode, useContext } from "react";
import { render } from "react-dom"
import { PlayerContext } from "../contexts";
import { APIRequest } from "../utils/request";

import charactersData from "../assets/data/characters.json";

const theUser = "felipe1"
const mockData= [{match_id:1, users:[
    {username:"felipe1", character:"sprite", score:5},{username:"felipe2", character:"sprite", score:3},{username:"felipe3", character:"sprite", score:4},{username:"felipe4", character:"sprite", score:2}
        ], started_at:"24/08/2022, 21:55", finished_at:"24/08/2022, 22:30"},
    {match_id:1, users:[
        {username:"felipe4", character:"sprite", score:5},{username:"felipe2", character:"sprite", score:3},{username:"felipe3", character:"sprite", score:4},{username:"felipe1", character:"sprite", score:1}
        ], started_at:"24/08/2022, 21:55", finished_at:"24/08/2022, 22:30"},
    {match_id:1, users:[
        {username:"felipe3", character:"sprite", score:5},{username:"felipe2", character:"sprite", score:3},{username:"felipe1", character:"sprite", score:4},{username:"felipe4", character:"sprite", score:2}
        ], started_at:"24/08/2022, 21:55", finished_at:"24/08/2022, 22:30"}]


interface HistoryPlayerData 
{
    username : string,
    character : number,
    score : number
} 

interface HistoryMatchData 
{
    match_id : string,
    started_at : string,
    finished_at : string
    users: HistoryPlayerData[]
} 

function HistoryMatch ({data} : {data : HistoryMatchData})
{
    const {match_id, started_at, finished_at, users} = data;
    const {getUserData} = useContext(PlayerContext);
    const iTime = new Date(started_at);
    const fTime = new Date(finished_at);
    const duration = fTime.getTime() - iTime.getTime();
    const durationTime = new Date(duration);

    const status = users[0].username == getUserData.username? "Vitória" : "Derrota";
    const user = users.find(user => user.username == getUserData.username)!;

    const [toggleClass,setToggle] = useState(false);
    function handleToggle()
    {
        if(toggleClass)
        {
            setToggle(false);
        } else {
            setToggle(true);
        }
    }

    function characterIcon (index : number)
    {
        return <img src={`${charactersData[index].portait}`} alt={charactersData[index].name} title={charactersData[index].name} />;
    }

    let playersTable:any[] = [<div className="flex justify-between items-center">Jogadores da partida:</div>];
    users.forEach((player:HistoryPlayerData) => 
    {
        playersTable.push(
        <div className="flex justify-between items-center">
            <span>{characterIcon(player.character)}</span>
            <span>{player.username}</span>
            <span>{player.score} Pontos</span>
        </div>);
    });

    function toDigits (num : number)
    {
        return num.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
    }
    playersTable.push(<div>Tempo de partida: {`${toDigits(durationTime.getMinutes())}:${toDigits(durationTime.getSeconds())}`} minutos</div>);
    
    return (
    <div className="flex flex-col flex-grow m-2 bg-[#ffffff79] box-border">
        <div onClick={()=>{handleToggle()}} className="flex flex-col flex-grow text-[12px] cursor-pointer bg-[#ffffffc0] p-1">
            <span className="flex justify-start flex-grow items-center text-[18px]">
                <span>{characterIcon(user.character)}</span>
                <span>{status}</span>
            </span>
            <span className="flex justify-between flex-grow">
                <span>{iTime.toLocaleDateString()}</span>
                <span>{user.score} P</span>
            </span>
        </div>
        <div className={`${toggleClass ? "h-auto p-2" : "h-0"} transition-all overflow-hidden text-[8px]`}>{playersTable}</div>
    </div>);
}

export function MatchHistoric()
{
    const {getUserData} = useContext(PlayerContext);
    const [matchs, setMatchs] = useState<ReactNode[]>([]);

    async function getHistory ()
    {
        console.log("Testando HISTORY")
        const historyData : HistoryMatchData[] = await (await APIRequest.execute({path:'/stats/history'})).result;
        console.log(historyData);

        setMatchs(historyData.map(data => <HistoryMatch data={data}/>));
    }

    useEffect(() => 
    {
        if(getUserData) getHistory ();
    }, [getUserData])

    return <div className="flex flex-col max-h-full h-fit overflow-hidden">
        <div className="w-full bg-[#343434] flex items-center justify-between p-2"><p className="text-[16px]">Histórico</p></div>
        <ul className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-[1px] box-border text-black text-[12px] flex-grow overflow-y-auto">
            <li>{matchs}</li>
        </ul>
    </div>;
}