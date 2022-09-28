import { IPlayerData } from "../game/player";
import { PlayerData } from "../models";
import { logOut } from "../utils/logout";
import configs from "../utils/config";
import { TutorialModal } from "./tutorial-modal";
import { useState } from "react";

export interface IPlayerStateProps 
{
    player:PlayerData
}

export function SpecsUser({player}:IPlayerStateProps )
{
    const [tutorial,handleTutorial] = useState(<></>)
    function closeModal(){
        handleTutorial(<></>)
    }
    function openTutorial(){
        handleTutorial(<TutorialModal closeModal={closeModal} />)
    }
    return(
        <div className="flex items-center px-3 py-1 w-full justify-between">
            <div className="rounded-full bg-[#D9D9D9] w-[50px] h-[50px]">
            </div>
            <div>
                <h3 className="pl-3 text-[18px]">{player.username}</h3>
                <span className="pl-3 text-[12px]">{player.score} P</span>
            </div>
            <div className="flex flex-col justify-between gap-1 w-fit ml-3">
                <button className="flex text-[12px] w-full p-1" onClick={()=>{openTutorial()}}>Tutorial</button>
                <button className="flex text-[12px] w-full p-1" onClick={()=>{logOut(configs.server)}}>LogOut</button>
            </div>
            {tutorial}
        </div>
    )
}

