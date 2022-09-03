export interface SocketMessage 
{
    type:string,
    data:any,
    date:number
}

export type SocketEvent = (data : any | undefined) => void;