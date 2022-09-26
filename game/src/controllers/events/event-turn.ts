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
    itemID? : number;

    public constructor (player : Player, match : Match)
    {
        super(player, match);
    }

    protected get data () 
    {
        return {event:this.eventID, limitTime:this.limitTime!, data:this.player.usableItems ()};
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
        if(option == -1) return false;
    
        if(this.player.removeItem({id:option, quanty:1}))
        {
            this.itemID = option;
            return true;
        }
        return false;
    }

    public async end (data : {sucess:boolean, items:Item[]})
    {
        if(this.itemID && this.itemID >= 0) 
        {
            await this.match.useItem(this.player, this.itemID);
        }
        return await super.end(data);
    }

}