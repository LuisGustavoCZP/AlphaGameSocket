import React, { createContext, Dispatch, ReactElement, useState } from "react";
import { Connection } from "../connection";


export type PropsGlobalContext =
{
    children: React.ReactNode
};

export type GlobalContextData =
{
    server : string,
    gameserver : string,
};

const DEFAULT_VALUE = {
    children : null as any
};

const GlobalContext = createContext<GlobalContextData>(null as any);

function GlobalContextProvider ({children} : PropsGlobalContext) 
{
    let server = location.host;
    let gameserver = location.host.replace("8000", "5000");

    if(location.port == "5173")
    {
        server = "localhost:8000"
        gameserver = "localhost:5000"
    }
    
    return (
        <GlobalContext.Provider value={{
            gameserver,
            server,
        }}>
        {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContextProvider }
export default GlobalContext;