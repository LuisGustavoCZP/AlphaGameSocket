import { gameSpeed } from "../../configs";
import { waitUntil } from "../../utils/wait";
import { Item } from "../game/item";
import { Match } from "../game/match";
import { Player } from "../game/player";
import { GameEvent } from "./event";

export class GameEventPass extends GameEvent
{
    eventID = 1;
    timeout = 20000*(1/gameSpeed);
    horizontal;

    public constructor (player : Player, match : Match, horizontal=true)
    {
        super(player, match);
        this.horizontal = horizontal;
        if(!horizontal) this.eventID = 2;
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
        return this.player.hasItem(0);
    }

    protected async execute (option : any)
    {
        if(option == 0) return false;
        this.player.removeItem({id:0, quanty:1})
        return true;
    }

    public async end (data : {sucess:boolean, items:Item[]})
    {
        return await super.end(data);
    }

}