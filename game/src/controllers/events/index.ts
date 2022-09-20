import { Player } from "../game/player";
import { GameEventAsk } from "./event-ask";
import { GameEventPass } from "./event-pass";
import { GameEventTurn } from "./event-turn";

export function createEvent (player : Player, eventID : number)
{
    switch (eventID)
    {
        case -1:
            return new GameEventTurn(player)
        case 0:
            return new GameEventAsk(player)
        case 1:
            return new GameEventPass(player)
        case 2:
            return new GameEventPass(player, true)
        default:
            return null;
    }
}