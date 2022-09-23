import { SpecsUser } from "./specsuser"
import React, { createContext, Dispatch, ReactElement, useContext, useEffect, useState } from "react";
import { PlayerContext } from "../contexts";
import { logOut } from "../utils/logout";
import { GlobalContext } from "../contexts";
export function UserInfo(){
    const {getUserData } = useContext(PlayerContext);
    const {server} = useContext(GlobalContext);
    console.log(getUserData)
    return <div className="w-1/5 bg-[#7A7A7A] h-full">
        <SpecsUser player={getUserData}/>
        <button onClick={()=>{logOut(server)}}></button>
    </div>
}