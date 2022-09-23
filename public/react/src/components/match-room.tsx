import { useContext, useEffect, useMemo, useState } from "react"
import { Connection } from "../connection";
import { PlayerContext } from "../contexts";
import GlobalContext from "../contexts/global-context";
import { Chat } from "./chat";
import { MatchPlayer } from "./match-player";
import { UserInfo } from "./userinfo";

interface MatchRoomPlayer 
{
    index:number,
    name:string,
    character:number,
    id?:string
}

export function MatchRoom (props : any)
{
    const {setPage, connection, setConnection, setMatchID} = useContext(PlayerContext);
    const [playerSelf, setPlayerSelf] = useState<MatchRoomPlayer>(null as any);
    const [players, setPlayers] = useState<MatchRoomPlayer[]>(new Array(4));
    const [playersNumber, setNumber] = useState (1);
    const [matchName, setMatchName] = useState (1);
    const [ready, setReady] = useState (0);
    /* const [getSocket, setSocket] = useState<Connection>(); */

    async function startConnection ()
    {
        connection.on("match-init", async ({name, player} : any) => 
        {
            setMatchName(name);
            setPlayerSelf(player);
            connection.off("match-init");
        });
        
        connection.on("match-start", async () => 
        {
            connection.instance.close();
            setConnection(null as any);
            setPage(2);
            connection.off("match-start");
        });

        connection.on("match-players", async ({players} : any) => 
        {
            setPlayers(players);
            let x:number = 0 ;
            players.forEach((ele : MatchRoomPlayer) => {
                if(ele){
                    x++;
                }
            });
            setNumber(x)
        });

        connection.on("match-ready", async({ready}) => 
        {
            setReady(ready);
        });

        connection.send("match-entered", true);
    }

    useEffect(() => 
    {
        startConnection ();
    }, []);

    function renderPlayers ()
    {
        const nextChar = () => 
        {
            connection?.send("character-next", true);
        };

        const backChar = () => 
        {
            connection?.send("character-last", true);
        };

        const setPlayerReady = (isReady : boolean) => 
        {
            connection?.send("player-ready", isReady);
        };

        return players.map((player : MatchRoomPlayer, index : number) => 
        {
            const isReady = (ready & (1 << index)) >  0;
            const isSelf = playerSelf && player && playerSelf.index == player.index;
            return <MatchPlayer key={index} player={player} isReady={isReady} isSelf={isSelf} nextChar={nextChar} backChar={backChar} setReady={setPlayerReady}/>;
        });
    }

    function exitRoom ()
    {
        connection.send("match-exit", true);
        connection.on("match-exit", async () => 
        {
            setMatchID(null as any);
            connection.off("match-exit");
            connection.off("match-ready");
            connection.off("match-players");
        });
    }

    return (
        <div className="match-room flex items-center m-0 justify-evenly h-screen">
            <UserInfo />
            <div className="flex flex-col list-none h-full w-3/5 gap-2 content-start place-self-start">
                <span className="w-full flex p-2 bg-[#3E3E3E] justify-between items-center">
                    <button onClick={exitRoom}>Voltar</button>
                    <h2 className='px-4 text-[24px]'>{matchName}</h2>
                    <p>{playersNumber}/4</p>
                </span>
                <ul className="flex flex-row list-none flex-grow h-full flex-wrap gap-2 justify-center box-border pb-2">
                    {renderPlayers ()}
                </ul>
            </div>
            <Chat/>
        </div>
    )
}