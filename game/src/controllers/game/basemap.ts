import { readFileSync } from "fs";

export interface BaseTile 
{
    index: number,
    id: number,
    d: number,
    next: number[]
    back: number[]
}

export class BaseMap 
{
    height : number;
    width: number;
    sides: number[][];
    tiles: Map<string, BaseTile>;

    private constructor(height : number, width: number, sides: number[][], baseTiles : [string, any][])
    {
        this.height = height;
        this.width = width;
        this.sides = sides;
        this.tiles = new Map<string, BaseTile>(baseTiles);
    }

    side (index : number)
    {
        return this.sides[index];
    }

    tile (key : string)
    {
        return this.tiles.get(key)!;
    }

    static load (source : string)
    {
        const baseData = JSON.parse(readFileSync(source).toString());
        return new BaseMap(baseData.height, baseData.width, baseData.sides, baseData.tiles);
    }
};