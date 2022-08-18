import { IAnimationsData } from "../animationdata";
import { IFrameData } from "./frameData";

export interface ISpriteData 
{
    frame : IFrameData,
    animations : IAnimationsData,
    src : string,
    id : number,
    size : number
}