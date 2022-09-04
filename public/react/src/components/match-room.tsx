import { useContext, useEffect, useMemo, useState } from "react"
import { Connection } from "../connection";
import GlobalContext from "../contexts/global-context";
import { Chat } from "./chat";
import { MatchPlayer } from "./match-player";
import { UserInfo } from "./userinfo";

export function MatchRoom (props : any)
{
    const {setPage, setID} = useContext(GlobalContext);
    const [player, setPlayer] = useState(null as any);
    const [players, setPlayers] = useState(null as any);
    const [playersNumber, setNumber] = useState (1)
    async function startConnection ()
    {
        const newconnection = new Connection();
        newconnection.add("match-update", async ({players} : any) => 
        {
            setPlayers(players);

        });
        newconnection.add("match-init", async ({player} : any) => 
        {
            setPlayer(player);
            console.log(player);
            setID(player.id)
            let x:number = 1 ;
            console.log(players)
            players.forEach((ele : any) => {
                if(ele){
                    x++;
                }
            });
            console.log(x)
            setNumber(x)
        });
        newconnection.add("match-start", async () => 
        {
            setPage(1);
            newconnection.instance.close();
        });
    }

    useEffect(() => 
    {
        startConnection ();
    }, []);

    function renderPlayers ()
    {
        
        if(!players || !player) return <></>;
        return players.map((player : any, index : number) => 
        {
            return <MatchPlayer key={index} player={player} />;
        });
    }

    return (
        <div className="match-room flex items-center m-0 justify-evenly h-screen">
            <UserInfo />
            <ul className=" flex list-none h-screen w-3/5 flex-wrap justify-center content-center gap-5 place-self-start">
            <li className="w-full flex justify-between p-4 bg-[#3E3E3E]">
                <p>Partida 1</p>
                <p>{playersNumber}/4</p>
            </li>
                {renderPlayers ()}

                <li className="w-full flex justify-between p-4 bg-[#3E3E3E]">
                    <p>Sprites do jogador vao aqui</p>
                </li>
            </ul>

            <Chat/>
        </div>
    )
}