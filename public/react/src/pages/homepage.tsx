import { useContext } from "react"
import { PlayerContext } from "../contexts";
import { GameRoom } from "../components/game-room";
import { MatchRoom } from "../components/match-room";
import { MainRoom } from "../components/main-room";

export function HomePage()
{
    const {getPage} = useContext(PlayerContext);
    const pages = [
        <MainRoom/>,
        <MatchRoom/>,
        <GameRoom/>
    ];

    return pages[getPage];
}