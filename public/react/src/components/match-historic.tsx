
export function MatchHistoric(){
    function generateHistoric(){
        //<tr className="flex justify-between pl-2 pr-3 items-center m-1"><td>Sprite</td><td>Vitoria/Derrota</td><td>Data</td><td>Pontuação</td></tr>
        return<></>
    }
    return <div>
        <div className="w-full bg-[#343434] flex items-center justify-between p-2"><p className="text-[16px]">Histórico</p></div>
        <table className="w-full bg-[#7A7A7A] flex flex-col text-lg gap-[1px] box-border text-black text-[12px] max-h-48 overflow-y-scroll">

                {generateHistoric ()}
            </table>
    </div>;
}