export interface IClosedPlayer
{
    id : string;
    index : number;
    name: string;
    character: number;
    points: number;
}

export interface IClosedMatch 
{
    id: string;
    createdAt: string;
    startedAt: string;
    endedAt: string;
    winner: number;
    players: IClosedPlayer[];
}