import { Group, Object3D } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const gltfLoader = new GLTFLoader();

export async function load (path : string)
{
    return new Promise<Object3D>((resolve, reject) => 
    {
        gltfLoader.load(path, function (gltf) 
        {
            resolve(gltf as unknown as Object3D);
        }, undefined, function (error) 
        {
            console.error(error);
            reject(error);
        });
    });
}