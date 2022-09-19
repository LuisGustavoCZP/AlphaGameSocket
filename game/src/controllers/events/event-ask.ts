import { waitUntil } from "../../utils/wait";
import { gameManager } from "../game";
import { Item } from "../game/item";
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
        this.askID = Math.floor(Math.random()*gameManager.questions.length);
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
        const question = gameManager.questions[this.askID];
        if(question.answer == option)
        {
            const item = Item.loot(0)!;
            this.player.addItem(item);
            return true;
        }
        return false;
    }

    public async end (data : {sucess:boolean, items:number[]})
    {
        await super.end(data);
    }

}