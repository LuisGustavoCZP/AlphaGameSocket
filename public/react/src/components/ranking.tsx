import { useEffect, useState } from "react";
import { APIRequest } from "../utils/request";
async function getData(){
    
    const res = await (await APIRequest.execute({path:'/stats/ranking'})).result;
    console.log(res)
    return 
}
async function generateRanking(setRanking:any){
    const dataMock = await (await APIRequest.execute({path:'/stats/ranking'})).result;
    dataMock.sort((a:any,b:any)=>{return b.score-a.score})
    const theRanking:any[] = []
    dataMock.forEach((ele:any)=>{
        theRanking.push(<tr className="flex justify-between pl-2 pr-3 items-center m-1"><td>{theRanking.length + 1}º</td><td>{ele.username}</td><td>{ele.score}</td></tr>)
    })
    setRanking(theRanking)
    return theRanking
}
export function Ranking(){
    const [ranking,setRanking] =useState(<></>)
    
    // const dataMock = [{
    //     username:"FelipeTR 1",
    //     wins:10
    // },
    // {
    //     username:"FelipeTR 4",
    //     wins:4
    // },
    // {
    //     username:"FelipeTR 2",
    //     wins:8
    // },
    // {
    //     username:"FelipeTR 3",
    //     wins:6
    // }]
    // getData()
    // const dataMock = getData()
    useEffect(()=>{
        generateRanking(setRanking)
    },[])
    
    return <div className="h-full max-h-fit overflow-y-auto">
        <div className="w-full bg-[#343434] flex items-center justify-between p-2"><p className="text-[16px]">Ranking</p></div>
            <table className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-[1px] box-border text-black text-[12px] max-h-48">
                <tr className="flex justify-between pl-2 pr-3 items-center m-1">
                    <td>Posição</td><td>Username</td><td>Pontuação</td>
                </tr>
                {ranking}
            </table>
    </div>;
}