import { useContext, useEffect, useMemo, useState } from "react"
import { Connection } from "../connection";
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
    const {setPage, setID, getID, server} = useContext(GlobalContext);
    const [playerSelf, setPlayerSelf] = useState<MatchRoomPlayer>(null as any);
    const [players, setPlayers] = useState<MatchRoomPlayer[]>(new Array(4));
    const [playersNumber, setNumber] = useState (1);
    const [ready, setReady] = useState (0);
    const [getSocket, setSocket] = useState<Connection>();

    async function startConnection ()
    {
        if(getID) return;
        const newconnection = new Connection(server);
        
        newconnection.on("onopen", () => 
        {
            newconnection.send("match-init", true)
        }); 
        
        newconnection.on("match-init", async ({player} : any) => 
        {
            setPlayerSelf(player);
            setID(player.id);
        });
        
        newconnection.on("match-players", async ({players} : any) => 
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

        newconnection.on("match-start", async () => 
        {
            setPage(1);
            newconnection.instance.close();
        });

        newconnection.on("match-ready", async({ready}) => 
        {
            setReady(ready);
        });

        setSocket(newconnection);
    }

    useEffect(() => 
    {
        startConnection ();
    }, []);

    function renderPlayers ()
    {
        const nextChar = () => 
        {
            getSocket?.send("character-next", true);
        };

        const backChar = () => 
        {
            getSocket?.send("character-last", true);
        };

        const setPlayerReady = (isReady : boolean) => 
        {
            getSocket?.send("player-ready", isReady);
        };

        return players.map((player : MatchRoomPlayer, index : number) => 
        {
            const isReady = (ready & (1 << index)) >  0;
            const isSelf = playerSelf && player && playerSelf.index == player.index;
            return <MatchPlayer key={index} player={player} isReady={isReady} isSelf={isSelf} nextChar={nextChar} backChar={backChar} setReady={setPlayerReady}/>;
        });
    }

    return (
        <div className="match-room flex items-center m-0 justify-evenly h-screen">
            <UserInfo />
            <ul className="flex list-none h-screen w-3/5 flex-wrap justify-center content-start gap-5 place-self-start">
                <li className="w-full flex justify-between p-2 bg-[#3E3E3E]">
                    <p>Partida 1</p>
                    <p>{playersNumber}/4</p>
                </li>
                {renderPlayers ()}
            </ul>
            <Chat/>
        </div>
    )
}