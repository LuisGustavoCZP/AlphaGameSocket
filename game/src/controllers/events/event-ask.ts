import { waitUntil } from "../../utils/wait";
import { Player } from "../game/player";
import { GameEvent } from "./event";

export class GameEventAsk extends GameEvent
{
    eventID = 0;
    timeout = 10000;
    askID;

    public constructor (player : Player)
    {
        super(player);
        this.askID = Math.floor(Math.random()*10);
    }

    protected get data () 
    {
        return {event:this.eventID, limitTime:this.limitTime!, data:this.askID};
    }

    public async start ()
    {
        await super.start();
    }
    
    public async check ()
    {
        return true;
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