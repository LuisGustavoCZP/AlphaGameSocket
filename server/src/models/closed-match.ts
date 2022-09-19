export interface IClosedPlayer
{
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
    players: IClosedPlayer[];
}