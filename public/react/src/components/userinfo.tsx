import React, { createContext, Dispatch, ReactElement, useContext, useEffect, useState } from "react";
import { SpecsUser } from "./specsuser"
import { Ranking } from "./ranking";
import { MatchHistoric } from "./match-historic";
import { PlayerContext } from "../contexts";

export function UserInfo(){
    const {getUserData } = useContext(PlayerContext);
    
    console.log(getUserData)
    return <div className="min-w-fit portrait:w-full bg-[#232323] min-h-fit landscape:h-full flex flex-col border-solid border-black border-r-2">
        <SpecsUser player={getUserData}/>
        <MatchHistoric/>
        <Ranking/>
    </div>
}