export function MatchPlayer ({index, player} : any)
{
    return (
        <li className="w-2/5 h-2/5 bg-[#343434] m-0 ">
            {player?.index}
        </li>
    )
}