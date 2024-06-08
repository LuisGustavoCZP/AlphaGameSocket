import React, { 
    createContext,
    Dispatch,
    ReactElement,
    useContext,
    useEffect,
    useState
} from "react";

import { SpecsUser } from "./specsuser"
import { Ranking } from "./ranking";
import { MatchHistoric } from "./match-historic";
import { PlayerContext } from "../contexts";

export function UserInfo(){
    const {getUserData } = useContext(PlayerContext);
    
    console.log(getUserData)
    return <div className="min-w-fit portrait:w-full bg-[#232323] min-h-fit landscape:h-full flex flex-col border-solid border-black border-r-2 portrait:h-1/4">
        <SpecsUser player={getUserData}/>
        <div className="flex w-full h-full flex-col portrait:flex-row overflow-hidden">
            <MatchHistoric/>
            <Ranking/>
        </div>
    </div>
}