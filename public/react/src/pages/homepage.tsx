import { UserInfo } from "../components/userinfo"
import { Chat } from "../components/chat"
import { SelectRoom } from "../components/select-room"


export function HomePage(){
    
    
    return (<div className="match-room flex items-center m-0 justify-between h-screen">
            <UserInfo />
            <SelectRoom />
            <Chat/>
    </div>)
}