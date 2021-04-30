let physobjs = [];
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
camera.position.z = 7;
camera.vel = {
    x: 0,
    y: 0,
    z: 0
};
physobjs.push(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
});
const cube = new THREE.Mesh(geometry, material);
initobj(cube);
physobjs.push(cube);


function animate() {
    physicsupdate();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function initobj(object) {
    object.vel = {
        x: 0,
        y: 0,
        z: 0
    };
    scene.add(object);
}

function physicsupdate() {
    ut = new Date().getTime();
    t += ut - lut;
    dt = ut - lut;
    lut = ut;
    for (let i = 0; i < physobjs.length; i++) {
        physobjs[i].position.x += physobjs[i].vel.x;
        physobjs[i].position.y += physobjs[i].vel.y;
        physobjs[i].position.z += physobjs[i].vel.z;
    }

}