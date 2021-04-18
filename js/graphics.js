let physicsobjects = [];
let t = 0;
let dt = 0;
let lut = 0;
let ut = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.rotation.order = 'ZYX';
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
});
const cube = new THREE.Mesh(geometry, material);
initobj(cube);


function animate() {
    physicsupdate();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function initobj(object){
    object.velocity = {x: 0, y: 0, z: 0};
    scene.add(object);
}

function physicsupdate(object){
    ut = new Date().getTime();
    t += ut - lut;
    dt = ut - lut;
    lut = ut;
    object.position.x += object.velocity.x;
    object.position.y += object.velocity.y;
    object.position.z += object.velocity.z;
}