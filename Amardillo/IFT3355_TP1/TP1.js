/**
 * UdeM IFT 3355, H20
 * TP 1 Template
 * Mise à jour par: Alexandre Dufour (p1054564)
 */
var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(10,15,40);
camera.lookAt(scene.position); 
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxisHelper(5) ;
scene.add(worldFrame);

var displayScreenGeometry = new THREE.CylinderGeometry(5, 5, 10, 32);
var displayMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.2});
var displayObject = new THREE.Mesh(displayScreenGeometry,displayMaterial);
displayObject.position.x = 0;
displayObject.position.y = 5;
scene.add(displayObject);
displayObject.parent = worldFrame;

// FLOOR 
var floorTexture = new THREE.ImageUtils.loadTexture('images/floor.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(1, 1);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
floor.parent = worldFrame;

// UNIFORMS
var remotePosition = {type: 'v3', value: new THREE.Vector3(0,0,0)};
var tvChannel = {type: 'i', value: 1};
var rotation ={type: 'f', value: degToRad(180.0)};

//Variable de gestion de la rotation lorsque tvChannel == 2
var channelTwo = false;
var rotationSpeed = 1.2;
var clockwise = true;


// MATERIALS
var armadilloMaterial = new THREE.ShaderMaterial({
  uniforms:{
    //Ajout de variable uniforme à l'Amardillo pour gérer son affichge selon le controlleur
    remotePosition : remotePosition,
    tvChannel: tvChannel,
    rotation: rotation,
  }
});
var remoteMaterial = new THREE.ShaderMaterial({
   uniforms: {
    remotePosition: remotePosition,
     tvChannel: tvChannel,
  },
});

// LOAD SHADERS
var shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/remote.vs.glsl',
  'glsl/remote.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

  remoteMaterial.vertexShader = shaders['glsl/remote.vs.glsl'];
  remoteMaterial.fragmentShader = shaders['glsl/remote.fs.glsl'];
})

// LOAD ARMADILLO
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if ( query.lengthComputable ) {
      var percentComplete = query.loaded / query.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    object.parent = worldFrame;
    scene.add(object);

  }, onProgress, onError);
}

loadOBJ('obj/armadillo.obj', armadilloMaterial, 3, 0,3,0, 0,Math.PI,0);

// CREATE REMOTE CONTROL
var remoteGeometry = new THREE.SphereGeometry(1, 32, 32);
var remote = new THREE.Mesh(remoteGeometry, remoteMaterial);
remote.parent = worldFrame;
scene.add(remote);

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {

  if (keyboard.pressed("W"))
    remotePosition.value.z -= 0.1;
  else if (keyboard.pressed("S"))
    remotePosition.value.z += 0.1;

  if (keyboard.pressed("A"))
    remotePosition.value.x -= 0.1;
  else if (keyboard.pressed("D"))
    remotePosition.value.x += 0.1;

  if (keyboard.pressed("R"))
    remotePosition.value.y += 0.1;
  else if (keyboard.pressed("F"))
    remotePosition.value.y -= 0.1;



  for (var i=1; i<=5; i++) {
    if (keyboard.pressed(i.toString())) {
      tvChannel.value = i;
      // Gestion de la rotation du tvChannel 2
      if(tvChannel.value == 2)
        channelTwo = true;
      else
        channelTwo = false;
      break;
    }
  }

  remoteMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
}

function degToRad(d) {
  return d * Math.PI / 180;
}



// SETUP UPDATE CALL-BACK
function update() {
  //Gestion de la rotation pour le tvChannel2
  if(channelTwo == true){
    if(clockwise == true) {
      rotation.value -= rotationSpeed / 60.0;
      if (rotation.value < degToRad(45.0))
        clockwise = false;
    }
    else {
      rotation.value += rotationSpeed / 60.0;
      if (rotation.value > degToRad(180.0))
        clockwise = true;
    }
  }

  checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

requestAnimationFrame(update);

