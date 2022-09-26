import { gameSpeed } from "../../configs";
import { waitUntil } from "../../utils/wait";
import { Item } from "../game/item";
import { Match } from "../game/match";
import { Player } from "../game/player";
import { GameEvent } from "./event";

export class GameEventSafe extends GameEvent
{
    eventID = -4;
    timeout = 10000*(1/gameSpeed);

    itemID : number;
    usableItems : Item[];

    public constructor (player : Player, match : Match, itemID : number)
    {
        super(player, match);
        this.itemID = itemID;
        this.usableItems = this.player.usableItems ().filter(item => 
        {
            if(item.id == this.itemID || item.id == 1) return true;
            return false;
        });
    }

    protected get data () 
    {
        return {event:this.eventID, limitTime:this.limitTime!, data:this.usableItems};
    }

    public async start ()
    {
        return await super.start();
    }
    
    public async check ()
    {
        return this.usableItems.some(item => this.player.hasItem(item.id));
    }

    protected async execute (option : any)
    {
        if(option == -1)
        {
            return false;
        }
        else if (option < this.usableItems.length)
        {
            const item = this.usableItems[option];
            this.player.removeItem({id:item.id, quanty:1});
            return item.id == 1? false : true;
        }
        return false;
    }

    public async end (data : {sucess:boolean, items:Item[]})
    {
        return await super.end(data);
    }

}