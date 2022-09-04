import { gameManager } from "./gamedata";
import { GameRender } from "./gamerender";
import { MapObject } from "./mapobject";

const gameRender = new GameRender(528, 528);

async function start () 
{
    gameRender.draw ();
} 

start ();