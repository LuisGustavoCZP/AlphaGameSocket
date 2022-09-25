import React, { createContext, Dispatch, ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connection } from "../connection";
import { PlayerData } from "../models";
import { APIRequest, APIRequestOptions } from "../utils/request";

export type PropsPlayerContext =
{
    page : number,
    children: React.ReactNode
};

export type RequestFunction = 
{

}

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
    const [getPage, setPage] = useState<number>(page);
    const [getUserData, setUserData] = useState<PlayerData>(null as any);
    const [connection, setConnection] = useState<Connection>(null as any);
    const [getMatchID, setMatchID] = useState<string>(null as any);

    async function request(path : string, method : string = 'GET', data? : any) 
    {
        const request = await APIRequest.execute({path, method, data});
        if(!request.sucess) 
        {
            navigate('/login', { replace: true }); 
            return request;
        }
        else return request;
    }

    async function requestUserData ()
    {
        const reqUserData = await request('/users');
        console.log(reqUserData);
        if(reqUserData.sucess) setUserData(reqUserData.result);
    }

    useEffect(() => 
    {
        requestUserData ();
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