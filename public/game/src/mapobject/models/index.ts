import { ISpriteSheetData } from "../../spriteobject/models"

export interface IMapData 
{
    orientation : string,
    renderorder : string,
    tilesets : IMapTileset[],
    tileheight : number,
    tilewidth : number,
    height : number,
    width : number,
    layers : IMapLayer[]
}

export interface IMapTileset 
{
    firstgid : number,
    source : string
}

export interface IMapLayer 
{
    id : number,
    type : string,
    name : string,
    visible : boolean,
    opacity : number,
    height : number,
    width : number,
    x: number,
    y: number,
    data: number[]
}

export interface ITilePropertyData
{
    name: string,
    type: string,
    value: any
}

export interface ITileData
{
    id: number,
    properties: ITilePropertyData[]
}

export interface ITileSetData extends ISpriteSheetData
{
    tiles: ITileData[]
}

