import React, { createContext, Dispatch, ReactElement, useContext, useEffect, useState } from "react";
import { SpecsUser } from "./specsuser"
import { Ranking } from "./ranking";
import { MatchHistoric } from "./match-historic";
import { PlayerContext } from "../contexts";
import { logOut } from "../utils/logout";
import { GlobalContext } from "../contexts";
export function UserInfo(){
    const {getUserData } = useContext(PlayerContext);
    const {server} = useContext(GlobalContext);
    console.log(getUserData)
    return <div className="w-1/5 bg-[#232323] h-full flex flex-col justify-between border-solid border-black border-r-2 ">
        <SpecsUser player={getUserData}/>
        <MatchHistoric/>
        <Ranking/>
        <button className="justify-self-end self-end" onClick={()=>{logOut(server)}}>LogOut</button>
    </div>
}