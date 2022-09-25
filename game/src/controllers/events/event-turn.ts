import { gameSpeed } from "../../configs";
import { waitUntil } from "../../utils/wait";
import { gameManager } from "../game";
import { Item } from "../game/item";
import { Match } from "../game/match";
import { Player } from "../game/player";
import { GameEvent } from "./event";

export class GameEventTurn extends GameEvent
{
    eventID = -1;
    timeout = 10000*(1/gameSpeed);
    
    public constructor (player : Player, match : Match)
    {
        super(player, match);
    }

    protected get data () 
    {
        return {event:this.eventID, limitTime:this.limitTime!};
    }

    public async start ()
    {
        return await super.start();
    }
    
    public async check ()
    {
        return true;
    }

    protected async execute (option : any)
    {
        
        return true;
    }

    public async end (data : {sucess:boolean, items:Item[]})
    {
        return await super.end(data);
    }

}