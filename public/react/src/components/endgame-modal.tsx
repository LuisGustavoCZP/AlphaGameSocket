
import charactersData from "../assets/data/characters.json"
function isTheWinner(result:any){
    if(result){
        return <div className="text-black">Vitória !!!</div>
    }
    return <div className="text-black">Derrota D: </div>

}

function renderFinalResult(players:any){
    return players?.map((player:any) => 
        {
            return (
                <li className={"flex justify-between pl-2 pr-2 items-center box-border cursor-default select-none text-black"}>
                    <span className="flex items-center justify-center">
                        {/* <img className="w-7 h-7" src={charactersData[player.character].portait}/> */}
                        <span>{player.username}</span>
                    </span>
                    <span>{player.score}P</span>
                </li>
            );
        }); 
}


export function EndGameModal({result,players}:any){
    return<div className="flex bg-[#00000099] items-center justify-center w-screen h-screen fixed m-0 ">
        <div className={`bg-[#D9D9D9] relative flex flex-col content-center items-center}`}>
        <div className="w-full text-[58px] bg-[#3E3E3E] pl-10 leading-[80px] flex justify-between">
            <p>Final de Jogo</p>
        </div>
        {isTheWinner(result)}

        <div>
            <div className="w-full bg-[#343434] flex items-center justify-between p-2">
                    <p className="text-[16px] text-white">Pontuação final</p>
                </div>
            <ul>
            <li className="flex justify-between pl-2 pr-3 items-center m-1 text-black">
                    <span>Username</span><span>Pontuação</span>
                </li>
                {renderFinalResult(players)}
            </ul>
            </div>
        </div>
    </div>
}