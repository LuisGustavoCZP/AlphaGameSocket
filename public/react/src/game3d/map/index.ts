import { Mesh } from "three";
import { gameData } from "../game-data";
import { GameObject } from "../gameobject";
import { IMapData, ITileEvent } from "./models";

export class MapObject
{
    public tiles : Mesh[];
    public width : number;
    public height : number;
    public tileHeight : number;
    public tileWidth : number;
    /* public events : Map<string, ITileEvent>; */
    public eventObjects : Map<string, GameObject>;

    constructor (data : IMapData)
    {
        this.tiles = [];
        /* this.events = new Map<string, ITileEvent>; */
        this.eventObjects = new Map<string, GameObject>;
        this.tileHeight = data.tileHeight;
        this.tileWidth = data.tileWidth;
        this.width = data.width;
        this.height = data.height;
        this.load(data);
    }

    public async load (data : IMapData)
    {
        
    }

    public updateEvents (events : ITileEvent[]) 
    {
        events.forEach(event => 
        {
            const eventData = gameData.eventsData[event.eventID];
            const mesh = gameData.meshs.get(eventData.mesh)!;
            const eventObject = new GameObject(`Events:${event.id}`, eventData.name, mesh, parseInt(event.id));
            /* this.events.set(event.id, event); */
            this.eventObjects.set(event.id, eventObject);
        });
        console.log("Eventos", events);
    }
}