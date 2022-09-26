export function Ranking(){
    const dataMock = [{
        username:"FelipeTR 1",
        wins:10
    },
    {
        username:"FelipeTR 4",
        wins:4
    },
    {
        username:"FelipeTR 2",
        wins:8
    },
    {
        username:"FelipeTR 3",
        wins:6
    }]
    function generateRanking(){
        dataMock.sort((a,b)=>{return b.wins-a.wins})
        const theRanking:any[] = []
        dataMock.forEach((ele)=>{
            theRanking.push(<tr className="flex justify-between pl-2 pr-3 items-center m-1"><td>{theRanking.length + 1}º</td><td>{ele.username}</td><td>{ele.wins}</td></tr>)
        })
        return theRanking
    }
    
    return <div className="h-fit">
        <div className="w-full bg-[#343434] flex items-center justify-between p-2"><p className="text-[16px]">Ranking</p></div>
            <table className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-[1px] box-border text-black text-[12px] max-h-48">
                <tr className="flex justify-between pl-2 pr-3 items-center m-1">
                    <td>Posição</td><td>Username</td><td>Vitórias</td>
                </tr>
                {generateRanking ()}
            </table>
    </div>;
}