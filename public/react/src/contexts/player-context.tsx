import React, { createContext, Dispatch, ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connection } from "../connection";
import { PlayerData } from "../models";
import GlobalContext from "./global-context";

export type PropsPlayerContext =
{
    page : number,
    children: React.ReactNode
};

export type PlayerContextData =
{
    getPage : number,
    setPage: Dispatch<number>,
    getUserData : PlayerData,
    setUserData : Dispatch<PlayerData>,
    connection : Connection, 
    setConnection : Dispatch<Connection>,
    getMatchID : string,
    setMatchID : Dispatch<string>
};

const DEFAULT_VALUE = {
    page: 0,
    children : null as any
};

const PlayerContext = createContext<PlayerContextData>(null as any);

function PlayerContextProvider ({children, page} : PropsPlayerContext) 
{
    const navigate = useNavigate()
    const { server } = useContext(GlobalContext);
    const [getPage, setPage] = useState<number>(page);
    const [getUserData, setUserData] = useState<PlayerData>(null as any);
    const [connection, setConnection] = useState<Connection>(null as any);
    const [getMatchID, setMatchID] = useState<string>(null as any);

    useEffect(() => 
    {
        fetch(`https://${server}/users/`)
        .then(async (resp) => 
        {
            const json = await resp.json();
            if(resp.status >= 400)
            {
                throw new Error(json.error);
            }
            else 
            {
                const userData = json.data;
                console.log(userData);
                setUserData(userData);
            }
        })
        .catch(err => 
        {
            console.log(err);
            navigate('/login', { replace: true });
        });
    }, [])


    useEffect(() => 
    {
        if(getMatchID && getPage == 0)
        {
            setPage(1);
        }
        else if(!getMatchID && getPage == 1)
        {
            setPage(0);
        }
    }, [getMatchID]);

    return (
        <PlayerContext.Provider value={{
            getPage,
            setPage,
            getUserData,
            setUserData,
            connection,
            setConnection,
            getMatchID,
            setMatchID
        }}>
        {children}
        </PlayerContext.Provider>
    );
};

export { PlayerContextProvider }
export default PlayerContext;