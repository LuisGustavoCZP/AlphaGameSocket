import { Match } from "../../controllers";
import { pubServer } from "./pub-server";

function sendMatch (match : Match)
{
    pubServer.publish("matchs", JSON.stringify(match));
}

export default { sendMatch };