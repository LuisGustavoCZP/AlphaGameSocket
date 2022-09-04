import { useContext } from "react"
import GlobalContext from "../contexts/global-context"
import { GameRoom } from "./game-room";
import { MatchRoom } from "./match-room";

export function MainRoom (props : any)
{
    const {getPage} = useContext(GlobalContext);
    const pages = [
        <MatchRoom/>,
        <GameRoom/>
    ];
    return pages[getPage];
}