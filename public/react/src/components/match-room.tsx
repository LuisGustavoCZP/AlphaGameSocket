import { useContext, useEffect, useMemo, useState } from "react"
import { Connection } from "../connection";
import GlobalContext from "../contexts/global-context";
import { MatchPlayer } from "./match-player";

export function MatchRoom (props : any)
{
    const {setPage, setID} = useContext(GlobalContext);
    const [player, setPlayer] = useState(null as any);
    const [players, setPlayers] = useState(null as any);

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
        <div className="match-room">
            <ul className="list-none">
                {renderPlayers ()}
            </ul>
        </div>
    )
}