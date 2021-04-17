// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCl0onEprDyN3OxCmtmRv386vwekDVUJuM",
  authDomain: "craftwithfriends-2239b.firebaseapp.com",
  projectId: "craftwithfriends-2239b",
  storageBucket: "craftwithfriends-2239b.appspot.com",
  messagingSenderId: "869182464764",
  appId: "1:869182464764:web:6e3fe57efbf78ec4b2ad79",
  measurementId: "G-QQVYQKNCZ1"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

const keydisplay = document.getElementById('key');
const keyinput = document.getElementById('keyinput');

const rangex = document.getElementById('rangex');
const rangey = document.getElementById('rangey');
const rangez = document.getElementById('rangez');

let campos = {x: 0, y: 0, z: 0};
let ppos = {x: 0, y: 0, z: 0};



// Handle onmessage events for the receiving channel.
// These are the data messages sent by the sending channel.

function handleReceiveMessage(event) {
  console.log(event.data);
}

// Handle onmessage events for the receiving channel.
// These are the data messages sent by the sending channel.

function rtcreceive(event) {
  try{
    let data = JSON.parse(event.data);
    console.log(data);

    if(data.position){
      console.log("yeye");
      cube.position.x = data.position.x;
      cube.position.y = data.position.y;
      cube.position.z = data.position.z;
    }
  } catch(err){
    console.log(event.data);
  }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2,2,2);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
let t = 0;

camera.position.z = 5;

rangex.oninput = function(){
  campos.x = rangex.value / 10;
  camera.position.x = campos.x;
  rtcsend({position: campos});
}

rangey.oninput = function(){
  campos.y = rangey.value / 10;
  camera.position.y = campos.y;
  rtcsend({position: campos});
}

rangez.oninput = function(){
  campos.z = rangez.value / 10;
  camera.position.z = campos.z;
  rtcsend({position: campos});
}

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  t += 0.01;
}

function onWindowResize(){
  console.log("resize");
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

animate();
