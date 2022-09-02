interface BaseTile 
{
    index: number,
    id: number,
    d: number,
    path: number[]
}

type BaseMap = BaseTile[];

export { BaseTile, BaseMap };