import { UserInfo } from "./userinfo"
import { Chat } from "./chat"
import { MatchsView } from "./matchs-view"

import { Connection } from '../connection';
import { PlayerContext, GlobalContext } from '../contexts';
import { useContext, useEffect } from "react";

export function MainRoom (props : any)
{
    const { server } = useContext(GlobalContext);
    const { getUserData, setConnection, connection } = useContext(PlayerContext);

    async function startConnection ()
    {
        const newconnection = new Connection(server);

        newconnection.on("onopen", () => 
        {
            console.log("Abriu conexão!")
            newconnection.on("auth", (id) => 
            {
                console.log("Autenticou!", id);
                setConnection(newconnection);
            });
            newconnection.send("auth", getUserData.id);
        });
    }

    if(!getUserData) return <></>;

    useEffect(() => 
    {
        startConnection ();
    }, [getUserData])

    if(!connection) return <></>;
    
    return (
        <div className="match-room flex items-center m-0 justify-between h-screen">
            <UserInfo />
            <MatchsView />
            <Chat/>
        </div>
    );
}