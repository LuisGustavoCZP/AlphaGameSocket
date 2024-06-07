import { gameSpeed } from "../../configs";
import { waitTime, waitUntil } from "../../utils/wait";
import { gameManager } from "../game";
import { Item } from "../game/item";
import { Match } from "../game/match";
import { Player } from "../game/player";
import { GameEvent } from "./event";

export class GameEventTrap extends GameEvent
{
    eventID = 3;
    timeout = 5000*(1/gameSpeed);

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
        /* 
        this.player.hasItem(1)
        console.log("Retrucando item", option);
        if(option == -1)
        {
            return false;
        }
        else if (option == 0)
        {
            console.log("Retirando item", option);
            if(this.player.removeItem({id:1, quanty:1})) 
            {
                this.player.protection ++;
            }
        } */
        return true;
    }

    public async end (data : {sucess:boolean, items:Item[]})
    {
        if(this.player.protection)
        {
            this.player.protection--;
        }
        else this.player.impeachment += 2;
        
        const resp = await super.end(data);
        //if(data.sucess) await waitTime(5000*(1/gameSpeed));
        return resp;
    }

}