import { Group, Object3D} from 'three';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
const loader = new FontLoader();

export async function load (path : string)
{
    return new Promise<Font>((resolve, reject) => 
    {
        loader.load(path, function (font : Font) 
        {
            resolve(font);
        }, undefined, function (error) 
        {
            console.error(error);
            reject(error);
        });
    });
}