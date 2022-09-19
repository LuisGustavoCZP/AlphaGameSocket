import * as THREE from "three";
import { Mesh, Vector3 } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { ITileSetData } from "../../game/mapobject/models";
import { gameData } from "../game-data";
import { GameObject } from "../gameobject";
import { IMapData, IMapSource, ITileEvent } from "./models";
import tilesheets from "../data/tilesheet.json";

function createMaterials ()
{
    const tiles = tilesheets[0].tiles;
    
    return tiles.map(tile => 
    {
        return new THREE.MeshStandardMaterial({color:tile.color, map:new THREE.TextureLoader().load(tile.map)});
    });
}

const materials = createMaterials();

const geometries = createGeometries ();

function createGeometries ()
{
    const geometry = new THREE.BufferGeometry();
    
    const positions = 
    [
        0,  0,  0,    // v1
        0,  5,  0,   // v2
        0,  5,  5,  // v3
        0,  0,  5  // v4
    ];
    
    //geometry.
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    
    return [new THREE.PlaneGeometry(5, 5), geometry,];
}

export class MapTile 
{
    public id : string;
    public x : number;
    public y : number;
    public layers : Mesh[];

    public constructor (id: string, x : number, y : number, layers : Mesh[])
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.layers = layers;
    }
}

export class MapObject
{
    public tiles : MapTile[];
    public width : number;
    public height : number;
    public tileHeight : number;
    public tileWidth : number;
    /* public events : Map<string, ITileEvent>; */
    public eventObjects : Map<string, GameObject>;

    constructor ()
    {
        this.tiles = [];
        /* this.events = new Map<string, ITileEvent>; */
        this.eventObjects = new Map<string, GameObject>;
        this.tileHeight = 0;
        this.tileWidth = 0;
        this.width = 0;
        this.height = 0;
    }

    public async load (data : IMapSource)
    {
        const tilemap = await fetch(data.mapSource).then(resp => resp.json()) as IMapData;
        this.tileHeight = tilemap.tileheight;
        this.tileWidth = tilemap.tilewidth;
        this.width = tilemap.width;
        this.height = tilemap.height;
    
        let t = 0;
        for (let j = 0; j < tilemap.height; j++)
        {
            const py = (j*this.tileHeight);
            for (let i = 0; i < tilemap.width; i++)
            {
                const px = (i*this.tileWidth);
                const id = t.toString();
                const k = t++;
                const layers = tilemap.layers.map(layer => 
                {
                    const tileID = layer.data[k]-1;
                    //console.log(tileID);
                    const mesh = new THREE.Mesh(geometries[0], materials[tileID<5?tileID:6]);
                    mesh.castShadow = true;
                    mesh.rotation.x = - Math.PI / 2;
                    mesh.position.x = (i*5) - 2.5 - 22.5;
                    mesh.position.z = (j*5) - 2.5 - 22.5;
                    mesh.receiveShadow = true;
                    gameData.scene.add(mesh);

                    return mesh;
                });


                const tile = new MapTile(id, px, py, layers);
                this.tiles.push(tile);
            }
        }

        this.updateEvents(data.data);
    }

    public updateEvents (events : ITileEvent[]) 
    {
        for (const event of events) 
        {
            const eventData = gameData.eventsData[event.eventID];
            
            let offset;
            const mesh = gameData.meshs.get(eventData.mesh)!;
            if(!mesh) continue;

            const eventObject = new GameObject(`Events:${event.id}`, eventData.name, mesh, parseInt(event.id), offset);
            this.eventObjects.set(event.id, eventObject);
        };
        console.log("Eventos", events);
    }
}