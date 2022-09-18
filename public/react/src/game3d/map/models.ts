export interface ITileEvent 
{
     id:string, 
     eventID: number
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

export interface IMapTileset 
{
    firstgid : number,
    source : string
}

export interface ITileData
{
    id: number
}

export interface ITilesetData 
{
     tiles: ITileData[]
}

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

export interface IMapSource 
{
     mapSource: string,
     data: ITileEvent[]
}