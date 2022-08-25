import { connection } from "./connection";
import { AnimatedObject, GameObject } from "./gameobject/gameobject";
import Maths from "./utils/maths";

export class PlayerController
{
    public player : GameObject | AnimatedObject | null;
    private targetX : number;
    private targetY : number;
    public controllerMode : {start : () => void, stop : () => void};

    constructor ()
    {
        this.player = null;
        this.targetX = 0;
        this.targetY = 0;
        this.controllerMode = mouseController(this);

        this.controllerMode.start();
    }

    public set type (isMouse : boolean)
    {
        if(isMouse) this.controllerMode = mouseController(this);
        else this.controllerMode = keyboardController(this);

        this.controllerMode.start();
    }
}

function mouseController (playerController : PlayerController)
{
    let targetX = 0;
    let targetY = 0;
    let isMoving = false;
    let speed = .5;

    function start ()
    {
        window.addEventListener("click", onclick);
    }

    function stop ()
    {
        window.removeEventListener("click", onclick);
        isMoving = false;
    }

    function onclick (e : MouseEvent)
    {
        const element = e.target as HTMLElement;
        
        targetX = e.offsetX - (element.clientWidth/2);
        targetY = e.offsetY - (element.clientHeight/2);
        console.log(targetX, targetY);
        connection.send("moveTo", {x:targetX, y:targetY});

        /* if(!isMoving) 
        {
            isMoving = true;
            moving ();
        } */
    }

    function moving ()
    {
        if(!isMoving) return;

        const player = playerController.player;
        if(!player) 
        {
            isMoving = false;
            return;
        }

        const dX = targetX - player.x;
        const dY = targetY - player.y;
        const d = Maths.distance(dX, dY);
        if(d < speed) 
        {
            if(player instanceof AnimatedObject) player.animation = player.animation.replace("walk", "idle");
            //else this.player.rotation = Maths.lerp(this.player.rotation, 0, .01);
            //console.log(player.animation);
            isMoving = false;
            return;
        }

        const n = Maths.normalize2(dX, dY);

        const isAnimated = player instanceof AnimatedObject;

        if(dX) 
        {
            player.x += n.x*speed;
            if(isAnimated) 
            {
                if(dX > 0) player.animation = "walk right";
                else player.animation = "walk left";
            }
        }
        if(dY) 
        {
            player.y += n.y*speed;
            if(isAnimated)
            {
                if(dY > 0) player.animation = "walk down";
                else player.animation = "walk up";
            }
        }

        if(!isAnimated) player.rotation = Maths.rLerp(player.rotation, Maths.rotateTo(270, n.x, n.y), .05);

        setTimeout(() => moving(), 10);
        //console.log(`pressed ${movingX}${movingY}`);
    }

    return {
        start,
        stop
    }
}

function keyboardController (playerController : PlayerController)
{
    let movingX = 0;
    let movingY = 0;
    let isControlling = false;

    const controls = {
        "w": {down: ()=>{ movingY = -1 }, up: ()=>{ movingY = 0 }},
        "s": {down: ()=>{ movingY = 1 }, up: ()=>{ movingY = 0 }},
        "a": {down: ()=>{ movingX = -1 }, up: ()=>{ movingX = 0 }},
        "d": {down: ()=>{ movingX = 1 }, up: ()=>{ movingX = 0 }},
        "ArrowUp" : {down: ()=>{ movingY = -1 }, up: ()=>{ movingY = 0 }},
        "ArrowDown": {down: ()=>{ movingY = 1 }, up: ()=>{ movingY = 0 }},
        "ArrowLeft": {down: ()=>{ movingX = -1 }, up: ()=>{ movingX = 0 }},
        "ArrowRight": {down: ()=>{ movingX = 1 }, up: ()=>{ movingX = 0 }}
    };

    function start ()
    {
        window.addEventListener("keydown", onkeydown);
        window.addEventListener("keyup", onkeyup);
    }

    function stop ()
    {
        window.removeEventListener("keydown", onkeydown);
        window.removeEventListener("keyup", onkeyup);
        isControlling = false;
    }

    function onkeydown (e : KeyboardEvent)
    {
        const control = (controls as any)[e.key];
        if(!control) return;
        control.down();
        if(!isControlling) 
        {
            isControlling = true;
            controlling ();
        }
    }

    function onkeyup (e : KeyboardEvent)
    {
        const control = (controls as any)[e.key];
        if(!control) return;
        control.up();
    }

    function controlling ()
    {
        const player = playerController.player;
        if(!player) 
        {
            isControlling = false;
            return;
        }

        if(movingX == 0 && movingY == 0) 
        {
            if(player instanceof AnimatedObject) player.animation = player.animation.replace("walk", "idle");
            //else this.player.rotation = Maths.lerp(this.player.rotation, 0, .01);
            //console.log(player.animation);
            isControlling = false;
            return;
        }

        if(movingX) 
        {
            player.x += movingX;
            if(player instanceof AnimatedObject) 
            {
                if(movingX > 0) player.animation = "walk right";
                else player.animation = "walk left";
            }
            else 
            {
                if(movingX > 0) player.rotation = Maths.angleLerp(player.rotation, 0, .1);
                else player.rotation = Maths.angleLerp(player.rotation, 180, .1);
            }
        }
        if(movingY) 
        {
            player.y += movingY;
            if(player instanceof AnimatedObject)
            {
                if(movingY > 0) player.animation = "walk down";
                else player.animation = "walk up";
            }
            else 
            {
                if(movingY > 0) player.rotation = Maths.angleLerp(player.rotation, 90, .1);
                else player.rotation = Maths.angleLerp(player.rotation, 270, .1);
            }
        }

        setTimeout(() => controlling(), 10);
        //console.log(`pressed ${movingX}${movingY}`);
    }

    return {
        start,
        stop
    }
}
