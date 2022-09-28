
import charactersData from "../assets/data/characters.json"
import { EventModal } from "./event-modal";
function isTheWinner(result:any)
{
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


export function EndGameModal({result, players}:any){
    return (// className="h-3/4 w-2/5 min-h-fit min-w-fit"
    <EventModal title="Final de Jogo">
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
    </EventModal>
    );
}