import React, { createContext, Dispatch, ReactElement, useState } from "react";


export type PropsGlobalContext =
{
    page : number,
    children: React.ReactNode
};

export type GlobalContextData =
{
    getPage : number,
    setPage: Dispatch<number>,
    getID : string,
    setID : Dispatch<string>,
    server : string,
    gameserver : string
};

const DEFAULT_VALUE = {
    page: 0,
    children : null as any
};

const GlobalContext = createContext<GlobalContextData>(null as any);

function GlobalContextProvider ({children, page} : PropsGlobalContext) 
{
    const [getPage, setPage] = useState<number>(page);
    const [getID, setID] = useState<string>(null as any);
    
    let server = location.host;
    let gameserver = location.host.replace("8000", "5000");

    if(location.port == "5173")
    {
        server = "localhost:8000"
        gameserver = "localhost:5000"
    }
    

    return (
        <GlobalContext.Provider value={{
            getPage,
            setPage,
            getID,
            setID,
            gameserver,
            server
        }}>
        {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContextProvider }
export default GlobalContext;