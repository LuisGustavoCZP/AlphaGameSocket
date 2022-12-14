import { UserInfo } from "./userinfo"
import { Chat } from "./chat"
import { MatchsView } from "./matchs-view"
import { masterAudio,AudioControl } from "./audiocontrol";
import { Connection } from '../connection';
import { PlayerContext } from '../contexts';
import { useContext, useEffect } from "react";
import configs from "../utils/config";
import { AudioMixer } from "./audio";

export function MainRoom (props : any)
{
    const { connection, getUserData, setPage, setConnection } = useContext(PlayerContext);

    async function startConnection ()
    {
        if(connection) return;
        const newconnection = new Connection(configs.server);

        newconnection.on("onopen", () => 
        {
            console.log("Abriu conexão!");
            newconnection.on("match-start", async () => 
            {
                newconnection.instance.close();
                setConnection(null as any);
                setPage(2);
                newconnection.off("match-start");
            });

            newconnection.on("auth", (id) => 
            {
                console.log("Autenticou!", id);
                setConnection(newconnection);
                newconnection.off("auth");
            });
            newconnection.send("auth", getUserData.id);
        });
    }

    if(!getUserData) return <></>;

    useEffect(() => 
    {
        startConnection ();
    }, [getUserData])

    function musicPlay ()
    {
        masterAudio.play('mainroomsoundtrack','./src/assets/sounds/sondtrack03calm.mp3').then(() => 
        {
            masterAudio.loop('mainroomsoundtrack')
            window.removeEventListener("click", musicPlay);
        }).catch(() => window.addEventListener("click", musicPlay));
    }

    useEffect(()=>
    {
        musicPlay ();
        
        return ()=>
        {
            window.removeEventListener("click", musicPlay);
            masterAudio.stop('mainroomsoundtrack')
        }
    },[])

    if(!connection) return <></>;
    
    return (
        <div className="match-room flex items-center m-0 h-screen portrait:flex-col">
            <AudioControl/>
            <UserInfo />
            <MatchsView />
            <Chat/>
        </div>
    );
}