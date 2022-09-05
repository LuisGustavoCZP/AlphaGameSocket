import { gameManager } from "../../connections";
import { Match } from "../../controllers";

function freeGameServer ()
{
    for(const [,cn] of gameManager.list)
    {
        return cn;
    }
}
//
export {freeGameServer};