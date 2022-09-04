export function MatchPlayer ({index, player} : any)
{   
    if(player){
        return (
            <li className="w-2/5 h-2/5 bg-[#343434] flex flex-col justify-center items-center content-center gap-3 ">
                <span>{player?.name}</span>
                <span>{player?.index}</span>
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