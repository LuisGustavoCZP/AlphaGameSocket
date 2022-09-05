interface BaseTile 
{
    index: number,
    id: number,
    d: number,
    next: number[]
    back: number[]
}

type BaseMap = BaseTile[];

export { BaseTile, BaseMap };