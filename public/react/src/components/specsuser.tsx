import { IPlayerData } from "../game/player";
import { PlayerData } from "../models";


export interface IPlayerStateProps 
{
    player:PlayerData
}

export function SpecsUser({player}:IPlayerStateProps ){

    return(
        <div className="flex items-center pl-3">
            

            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="25" fill="#D9D9D9"/>
            </svg>
            <h3 className="pl-3">
                {player.username}
            </h3>


        </div>
    )
}

