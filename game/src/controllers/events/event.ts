import { waitUntil } from "../../utils/wait";
import { Match } from "../game/match";
import { Player } from "../game/player";

export abstract class GameEvent
{
    abstract eventID : number;
    abstract timeout : number;
    player : Player;
    #executed : boolean;
    //sucess : boolean;
    limitTime? : number;

    public constructor (player : Player)
    {
        this.player = player;
        this.#executed = false;
    }

    protected get data () 
    {
        return {event:this.eventID, limitTime:this.limitTime!};
    }

    public async start ()
    {
        this.limitTime = Date.now() + this.timeout*Match.deltaSpeed;

        let executionSucess = false;
        this.player.on("execute-event", async (option) => 
        { 
            this.player!.off("execute-event");
            executionSucess = await this.execute(option);
            this.#executed = true; 
        });

        this.player.send("start-event", this.data);
        await waitUntil(() => (this.#executed || Date.now() >= this.limitTime!));
        await this.end({sucess:executionSucess, items:[]});
    }
    
    public abstract check () : Promise<boolean>;

    protected abstract execute (option : any) : Promise<boolean>;

    public async end (data : {sucess:boolean, items:number[]})
    {
        this.player!.send("end-event", data);
    }

}