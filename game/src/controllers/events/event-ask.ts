import { gameSpeed } from "../../configs";
import { waitTime, waitUntil } from "../../utils/wait";
import { gameManager } from "../game";
import { Item } from "../game/item";
import { Match } from "../game/match";
import { Player } from "../game/player";
import { GameEvent } from "./event";

export class GameEventAsk extends GameEvent
{
    eventID = 0;
    timeout = 10000*(1/gameSpeed);
    askID : number;
    
    public constructor (player : Player, match : Match)
    {
        super(player, match);
        this.askID = Math.floor(Math.random()*gameManager.questions.length);
    }

    protected get data () 
    {
        return {event:this.eventID, limitTime:this.limitTime!, data:this.askID};
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
        const question = gameManager.questions[this.askID];
        console.log(`Answer is ${question.answer} == ${option}`)
        if(question.answer == option)
        {
            const item = Item.loot(0)!;
            this.player.addItem(item);
            this.items.push(item);
            return true;
        }
        return false;
    }

    public async end (data : {sucess:boolean, items:Item[]})
    {
        const resp = await super.end(data);
        if(data.sucess) await waitTime(5000*(1/gameSpeed));
        return resp;
    }

}