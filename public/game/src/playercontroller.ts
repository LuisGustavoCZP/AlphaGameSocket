import { AnimatedObject } from "./gameobject";

export class PlayerController
{
    public player : AnimatedObject | null;
    private movingX : number;
    private movingY : number;
    private isControlling : boolean;

    constructor ()
    {
        this.player = null;
        this.movingX = 0;
        this.movingY = 0;
        this.isControlling = false;

        window.addEventListener("keydown", (e) => 
        {
            const control = (this.controls as any)[e.key];
            if(!control) return;
            control.down();
            if(!this.isControlling) 
            {
                this.isControlling = true;
                this.controlling ();
            }
        });

        window.addEventListener("keyup", (e) => 
        {
            const control = (this.controls as any)[e.key];
            if(!control) return;
            control.up();
        });
    }

    private controls = {
        "w": {down: ()=>{ this.movingY = -1 }, up: ()=>{ this.movingY = 0 }},
        "s": {down: ()=>{ this.movingY = 1 }, up: ()=>{ this.movingY = 0 }},
        "a": {down: ()=>{ this.movingX = -1 }, up: ()=>{ this.movingX = 0 }},
        "d": {down: ()=>{ this.movingX = 1 }, up: ()=>{ this.movingX = 0 }},
        "ArrowUp" : {down: ()=>{ this.movingY = -1 }, up: ()=>{ this.movingY = 0 }},
        "ArrowDown": {down: ()=>{ this.movingY = 1 }, up: ()=>{ this.movingY = 0 }},
        "ArrowLeft": {down: ()=>{ this.movingX = -1 }, up: ()=>{ this.movingX = 0 }},
        "ArrowRight": {down: ()=>{ this.movingX = 1 }, up: ()=>{ this.movingX = 0 }}
    };

    private controlling ()
    {
        if(!this.player) 
        {
            this.isControlling = false;
            return;
        }

        if(this.movingX == 0 && this.movingY == 0) 
        {
            this.player.animation = this.player.animation.replace("walk", "idle");
            //console.log(player.animation);
            this.isControlling = false;
            return;
        }

        if(this.movingX) 
        {
            this.player.x += this.movingX;
            if(this.movingX > 0) this.player.animation = "walk right";
            else this.player.animation = "walk left";
        }
        if(this.movingY) 
        {
            this.player.y += this.movingY;
            if(this.movingY > 0) this.player.animation = "walk down";
            else this.player.animation = "walk up";
        }

        setTimeout(() => this.controlling(), 10);
        //console.log(`pressed ${movingX}${movingY}`);
    }
}
