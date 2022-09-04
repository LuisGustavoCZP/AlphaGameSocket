import { gameManager } from "../../connections";
import { Match } from "../../controllers";

function sendMatch (match : any)
{
    for(const [,cn] of gameManager.list)
    {
        cn.send("match-init", match);
    }
}

export {sendMatch};