import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { gameData } from './game-data';
import { gltf } from './utils/loaders';

async function start () 
{
    await gameData.load();
}