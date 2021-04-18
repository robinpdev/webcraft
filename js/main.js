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

let campos = {
  x: 0,
  y: 0,
  z: 0
};
let ppos = {
  x: 0,
  y: 0,
  z: 0
};

// Handle onmessage events for the receiving channel.
// These are the data messages sent by the sending channel.

function handleReceiveMessage(event) {
  console.log(event.data);
}

// Handle onmessage events for the receiving channel.
// These are the data messages sent by the sending channel.

function rtcreceive(event) {
  try {
    let data = JSON.parse(event.data);
    console.log(data);

    if (data.position) {
      console.log("yeye");
      cube.position.x = data.position.x;
      cube.position.y = data.position.y;
      cube.position.z = data.position.z;
    }
  } catch (err) {
    console.log(event.data);
  }
}



// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

document.body.appendChild(renderer.domElement);
renderer.domElement.onclick = function () {
  renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || renderer.domElement.mozRequestPointerLock;
  renderer.domElement.requestPointerLock();
};


rangex.oninput = function () {
  campos.x = rangex.value / 10;
  camera.position.x = campos.x;
  rtcsend({
    position: campos
  });
}

rangey.oninput = function () {
  campos.y = rangey.value / 10;
  camera.position.y = campos.y;
  rtcsend({
    position: campos
  });
}

rangez.oninput = function () {
  campos.z = rangez.value / 10;
  camera.position.z = campos.z;
  rtcsend({
    position: campos
  });
}

function onWindowResize() {
  console.log("resize");
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);


function mousemove(e){
  camera.rotation.y += -e.movementX / 100.0;
  camera.rotation.x += -e.movementY / 100.0;
}

function lockChangeAlert() {
  if (document.pointerLockElement === renderer.domElement ||
      document.mozPointerLockElement === renderer.domElement) {
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", mousemove, false);
    document.onkeydown
  } else {
    console.log('The pointer lock status is now unlocked');  
    document.removeEventListener("mousemove", mousemove, false);
  }
}

//set time for phycics updates
ut = new Date().getTime();
lut = ut;
//start the drawing to the canvas
animate();
