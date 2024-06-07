import { Match } from "../game/match";
import { Player } from "../game/player";
import { GameEventAsk } from "./event-ask";
import { GameEventPass } from "./event-pass";
import { GameEventSafe } from "./event-safe";
import { GameEventTrap } from "./event-trap";
import { GameEventTurn } from "./event-turn";

export function createEvent (player : Player, match : Match, eventID : number, data? : any)
{
    switch (eventID)
    {
        case -4:
            return new GameEventSafe(player, match, data)
        case -1:
            return new GameEventTurn(player, match)
        case 0:
            return new GameEventAsk(player, match)
        case 1:
            return new GameEventPass(player, match)
        case 2:
            return new GameEventPass(player, match, true)
        case 3:
            return new GameEventTrap(player, match)
        case 4:
            return new GameEventAsk(player, match)
        default:
            return null;
    }
}