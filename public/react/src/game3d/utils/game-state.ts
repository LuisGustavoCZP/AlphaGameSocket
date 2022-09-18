import * as THREE from 'three';

export function createGameState ()
{
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set( 0, 80, -80 );
    camera.lookAt( 30, 1, 30 );

    const canvas = document.getElementById("canvas_screen")!;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setSize(window.innerWidth/2, window.innerHeight/2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.castShadow = true;
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    function render ()
    {
        renderer.render(scene, camera);
    }

    return {scene, camera, render};
}