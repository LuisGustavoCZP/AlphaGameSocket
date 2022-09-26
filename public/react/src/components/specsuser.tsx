import { IPlayerData } from "../game/player";
import { PlayerData } from "../models";


export interface IPlayerStateProps 
{
    player:PlayerData
}

export function SpecsUser({player}:IPlayerStateProps ){

    return(
        <div className="flex items-center px-3 py-1">
            <div className="rounded-full bg-[#D9D9D9] w-[50px] h-[50px]">

            </div>
            <div>
                <h3 className="pl-3 text-[18px]">{player.username}</h3>
                <span className="pl-3 text-[12px]">{player.score} P</span>
            </div>
        </div>
    )
}

