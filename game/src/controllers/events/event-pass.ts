import { waitUntil } from "../../utils/wait";
import { Player } from "../game/player";
import { GameEvent } from "./event";

export class GameEventPass extends GameEvent
{
    eventID = 1;
    timeout = 10000;
    horizontal;

    public constructor (player : Player, horizontal=true)
    {
        super(player);
        this.horizontal = horizontal;
        if(!horizontal) this.eventID = 2;
    }

    protected get data () 
    {
        return {event:this.eventID, limitTime:this.limitTime!};
    }

    public async start ()
    {
        await super.start();
    }
    
    public async check ()
    {
        return false;
    }

    protected async execute (option : any)
    {
        return true;
    }

    public async end (data : {sucess:boolean, items:number[]})
    {
        await super.end(data);
    }

}