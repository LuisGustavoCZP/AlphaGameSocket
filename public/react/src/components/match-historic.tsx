import { useEffect, useState } from "react";
import { render } from "react-dom"
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

function selectUser(ele:any){
    let user ={username:"felipe1", character:"sprite", score:5,status:"Vitória"};
    ele.users.forEach((ele2:any)=>{
        if(ele2.username == theUser){
            user = ele2
        }
    })
    if(theUser==ele.users[0].username){
        user.status = "Vitória"
    }else{
        user.status = "Derrota"
    }
    return user
}
function GenerateHistoric(){
    

    const matchs:any = []
    mockData.forEach((ele:any)=>{
        function handleToggle(){
            if(toggleClass){
                setToggle(false)
            }else{
                setToggle(true)
            }
        }
        const [toggleClass,setToggle] = useState(false)
        const user = selectUser(ele)
        let playersTable:any[] = [];
        ele.users.forEach((element:any) => {
            playersTable.push(<div className="flex justify-between items-center"><span>{element.character}</span><span>{element.username}</span><span>{element.score} Pontos</span></div>)
        });
        matchs.push(<div className="w-full ">
            <tr onClick={()=>{handleToggle()}} className="flex justify-between items-center text-[12px] cursor-pointer"><td>{user.character}</td><td>{user.status}</td><td>{ele.started_at}</td><td>{user.score} P</td></tr>
            <div className={`${toggleClass ? "h-auto" : "h-0"} transition-all overflow-hidden text-[8px]`} >{playersTable}</div>
        </div>)
    })
    //<tr className="flex justify-between pl-2 pr-3 items-center m-1"><td>Sprite</td><td>Vitoria/Derrota</td><td>Data</td><td>Pontuação</td></tr>

    return <tr>{matchs}</tr>
}


export function MatchHistoric(){

    function matchData(matchData:any[]){

    }


    return <div>
        <div className="w-full bg-[#343434] flex items-center justify-between p-2"><p className="text-[16px]">Histórico</p></div>
        <table className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-[1px] box-border text-black text-[12px] max-h-48 overflow-y-scroll">
                <GenerateHistoric/>
            </table>
    </div>;
}