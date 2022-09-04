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
    setID : Dispatch<string>
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

    return (
        <GlobalContext.Provider value={{
            getPage,
            setPage,
            getID,
            setID
        }}>
        {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContextProvider }
export default GlobalContext;