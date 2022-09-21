import { UserInfo } from "./userinfo"
import { Chat } from "./chat"
import { MatchsView } from "./matchs-view"

export function MainRoom (props : any)
{
    return (
        <div className="match-room flex items-center m-0 justify-between h-screen">
            <UserInfo />
            <MatchsView />
            <Chat/>
        </div>
    );
}