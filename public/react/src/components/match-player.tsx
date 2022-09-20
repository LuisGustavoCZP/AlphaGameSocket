import charactersData from "../assets/data/characters.json"

export function MatchPlayer ({index, player, isSelf} : any)
{  
    if(player)
    {
        const character = charactersData[player.character];
        const playerImg = <img src={character.portait} alt="" className=" w-20 h-20" />;

        function isPlayer ()
        {
            return (
                <span className="flex">
                    <button className="w-fit h-fit p-0 bg-transparent text-white">{'<'}</button>
                    {playerImg}
                    <button className="w-fit h-fit p-0 bg-transparent text-white">{'>'}</button>
                </span>
            );
        }

        return (
            <li className="w-2/5 h-2/5 bg-[#343434] flex flex-col justify-center items-center content-center gap-3 ">
                <span>{player.name}</span>
                {isSelf?isPlayer ():playerImg}
                <span>{character.name}</span>
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