import { Match } from "../game/match";
import { Player } from "../game/player";
import { GameEventAsk } from "./event-ask";
import { GameEventPass } from "./event-pass";
import { GameEventSafe } from "./event-safe";
import { GameEventTurn } from "./event-turn";

export function createEvent (player : Player, match : Match, eventID : number)
{
    switch (eventID)
    {
        case -1:
            return new GameEventTurn(player, match)
        case 0:
            return new GameEventAsk(player, match)
        case 1:
            return new GameEventPass(player, match)
        case 2:
            return new GameEventPass(player, match, true)
        case 3:
            return new GameEventSafe(player, match)
        default:
            return null;
    }
}