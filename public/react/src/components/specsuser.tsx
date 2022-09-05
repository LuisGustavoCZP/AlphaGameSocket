import { IPlayerData } from "../game/player";

export interface IPlayerStateProps 
{
    players?:IPlayerData[]
}

export function SpecsUser({players}:IPlayerStateProps ){
    
    if(players == undefined){
        return(        <div className="flex items-center pl-3">
            

        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="25" fill="#D9D9D9"/>
        </svg>
        <h3 className="pl-3">
            Loading ...
        </h3>


    </div>)
    }
    let player ;
    players.forEach(e=>{
        if(e.isPlayer){
            player = e.name;
        }
    })
    return(
        <div className="flex items-center pl-3">
            

            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="25" fill="#D9D9D9"/>
            </svg>
            <h3 className="pl-3">
                {player}
            </h3>


        </div>
    )
}

