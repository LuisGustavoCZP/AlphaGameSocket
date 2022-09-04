import img1 from "../assets/personagens/personagem1.png"
import img2 from "../assets/personagens/personagem2.png"
import img3 from "../assets/personagens/personagem3.png"
import img4 from "../assets/personagens/personagem4.png"
import img5 from "../assets/personagens/personagem5.png"
const spritePlayers = [img1,img2,img3,img4,img5 ]
export function MatchPlayer ({index, player} : any)
{   
    if(player){
        return (
            <li className="w-2/5 h-2/5 bg-[#343434] flex flex-col justify-center items-center content-center gap-3 ">
                <span>{player?.name}</span>
                <img src={spritePlayers[player.character]} alt="" className=" w-5 h-5" />
                <span>{player?.character}</span>
            </li>
        )
    }else{
        return (
            <li className="w-2/5 h-2/5 bg-[#343434] flex justify-center items-center content-center ">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M90 0H110V200H90V0Z" fill="#D9D9D9"/>
                <rect y="90" width="200" height="20" fill="#D9D9D9"/>
                </svg>
            </li>
        )
    }

}