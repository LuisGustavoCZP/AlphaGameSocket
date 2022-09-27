import React, { createContext, Dispatch, ReactElement, useContext, useEffect, useState } from "react";
import { SpecsUser } from "./specsuser"
import { Ranking } from "./ranking";
import { MatchHistoric } from "./match-historic";
import { PlayerContext } from "../contexts";
import { logOut } from "../utils/logout";
import configs from "../utils/config";
import { TutorialModal } from "./tutorial-modal";
export function UserInfo(){
    const {getUserData } = useContext(PlayerContext);
    const [tutorial,handleTutorial] = useState(<></>)
    function closeModal(){
        handleTutorial(<></>)
    }
    function openTutorial(){
        handleTutorial(<TutorialModal closeModal={closeModal} />)
    }
    console.log(getUserData)
    return <div className="w-1/5 bg-[#232323] h-full flex flex-col justify-between border-solid border-black border-r-2">
        <SpecsUser player={getUserData}/>
        <MatchHistoric/>
        <Ranking/>
        {tutorial}
        <div className="justify-self-end self-end flex justify-between w-full">
            <button className="justify-self-end self-end" onClick={()=>{openTutorial()}}>Tutorial</button>
            <button className="justify-self-end self-end" onClick={()=>{logOut(configs.server)}}>LogOut</button>
        </div>
    </div>
}