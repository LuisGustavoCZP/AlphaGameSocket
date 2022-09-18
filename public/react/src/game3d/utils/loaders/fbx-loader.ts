import { Group, Object3D } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
const loader = new FBXLoader();

export async function load (path : string)
{
    return new Promise<Object3D>((resolve, reject) => 
    {
        loader.load(path, function (fbx) 
        {
            resolve(fbx);
        }, undefined, function (error) 
        {
            console.error(error);
            reject(error);
        });
    });
}