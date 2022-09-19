import { Group, Object3D } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const loader = new GLTFLoader();

export async function load (path : string)
{
    return new Promise<Object3D>((resolve, reject) => 
    {
        loader.load(path, function (gltf) 
        {
            const anims = gltf.animations.filter(anim => !anim.name.includes('_'));
            const scene = gltf.scene;
            console.log(anims, scene.animations);
            scene.animations = anims;
            scene.castShadow = true;
            resolve(scene);
        }, undefined, function (error) 
        {
            console.error(error);
            reject(error);
        });
    });
}