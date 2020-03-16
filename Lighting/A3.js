/**
 * UdeM IFT 3355, H20
 * TP 3 Template
 * Mise à jour par: Alexandre Dufour (p1054564)
 */
var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var aspect = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
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

// FLOOR WITH CHECKERBOARD 
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

//!!!!!!!!!! Texture for the sphere in part 4 !!!!!!!!!!!
var sphereTexture =  new THREE.ImageUtils.loadTexture('images/gravel-rocks-texture.jpg');

// !!!!!!!!!  Parameters defining the light position !!!!!!!!!
var lightColor = new THREE.Vector3(1,1,1);
var ambientColor = new THREE.Vector3(0.4,0.4,0.4);
var lightDirection = new THREE.Vector3(0.49,0.79,0.49);


// !!!!!!!!! Material properties !!!!!!!!!!
var kAmbient = 0.4;
var kDiffuse = 0.8;
var kSpecular = 0.8;

var shininess = 10.0;

//!!!!!!!!! New light !!!!!!!!!!!!!!!!!
var lightColor2 = new THREE.Vector3(0,0,1);
var lightDirection2 = new THREE.Vector3(-0.49,-0.79,-0.49);


// MATERIALS
var gouraudMaterial = new THREE.ShaderMaterial({
   uniforms: {
       lightDirection: {type: 'v3', value: lightDirection},
       kDiffuse: {type: 'f', value: kDiffuse},
       lightColor: {type: 'v3', value: lightColor},
       ambientColor: {type: 'v3', value: ambientColor},
       kSpecular: {type: 'f', value: kSpecular},
       shininess: {type: 'f', value: shininess},
       kAmbient: {type: 'f', value: kAmbient},

   },
});
//!!!!!!!Nouveau material pour la seconde lumière!!!!!!!
var gouraudMaterial2 = new THREE.ShaderMaterial({
    uniforms: {
        lightDirection: {type: 'v3', value: lightDirection},
        kDiffuse: {type: 'f', value: kDiffuse},
        lightColor: {type: 'v3', value: new THREE.Vector3(0,1,0)},
        ambientColor: {type: 'v3', value: ambientColor},
        kSpecular: {type: 'f', value: kSpecular},
        shininess: {type: 'f', value: shininess},
        kAmbient: {type: 'f', value: kAmbient},
        lightDirection2: {type: 'v3', value: lightDirection2},
        lightColor2: {type: 'v3', value: lightColor2},

    },
});

var gouraudMaterial3 = new THREE.ShaderMaterial({
    uniforms: {
        lightDirection: {type: 'v3', value: lightDirection},
        kDiffuse: {type: 'f', value: kDiffuse},
        lightColor: {type: 'v3', value: new THREE.Vector3(1,0,1)},
        ambientColor: {type: 'v3', value: ambientColor},
        kSpecular: {type: 'f', value: kSpecular},
        shininess: {type: 'f', value: shininess},
        kAmbient: {type: 'f', value: kAmbient},

    },
});

var phongMaterial = new THREE.ShaderMaterial({
   uniforms: {
       lightDirection: {type: 'v3', value: lightDirection},
       kDiffuse: {type: 'f', value: kDiffuse},
       lightColor: {type: 'v3', value: lightColor},
       ambientColor: {type: 'v3', value: ambientColor},
       kSpecular: {type: 'f', value: kSpecular},
       shininess: {type: 'f', value: shininess},
       kAmbient: {type: 'f', value: kAmbient},
       lightDirection2: {type: 'v3', value: lightDirection2},
       lightColor2: {type: 'v3', value: lightColor2},
  },
});

var bPhongMaterial = new THREE.ShaderMaterial({
   uniforms: {
       lightDirection: {type: 'v3', value: lightDirection},
       kDiffuse: {type: 'f', value: kDiffuse},
       lightColor: {type: 'v3', value: lightColor},
       ambientColor: {type: 'v3', value: ambientColor},
       kSpecular: {type: 'f', value: kSpecular},
       shininess: {type: 'f', value: shininess},
       kAmbient: {type: 'f', value: kAmbient},
  },
});

var textureMaterial = new THREE.ShaderMaterial({
  uniforms: {
      sphereTexture: {type: 't', value: sphereTexture},
  },

});

// LOAD SHADERS
var shaderFiles = [
  'glsl/gouraud.fs.glsl',
  'glsl/gouraud.vs.glsl',
    'glsl/gouraud2.fs.glsl',
    'glsl/gouraud2.vs.glsl',
    'glsl/gouraud3.fs.glsl',
    'glsl/gouraud3.vs.glsl',
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/phong_blinn.vs.glsl',
  'glsl/phong_blinn.fs.glsl',
  'glsl/texture.fs.glsl',
  'glsl/texture.vs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
 gouraudMaterial.vertexShader = shaders['glsl/gouraud.vs.glsl'];
 gouraudMaterial.fragmentShader = shaders['glsl/gouraud.fs.glsl'];
 gouraudMaterial2.vertexShader = shaders['glsl/gouraud2.vs.glsl'];
 gouraudMaterial2.fragmentShader = shaders['glsl/gouraud2.fs.glsl'];
 gouraudMaterial3.vertexShader = shaders['glsl/gouraud3.vs.glsl'];
 gouraudMaterial3.fragmentShader = shaders['glsl/gouraud3.fs.glsl'];
 phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
 phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
 bPhongMaterial.vertexShader = shaders['glsl/phong_blinn.vs.glsl'];
 bPhongMaterial.fragmentShader = shaders['glsl/phong_blinn.fs.glsl'];
 textureMaterial.fragmentShader = shaders['glsl/texture.fs.glsl'];
 textureMaterial.vertexShader = shaders['glsl/texture.vs.glsl'];
  
textureMaterial.needsUpdate = true;
phongMaterial.needsUpdate = true;
bPhongMaterial.needsUpdate = true;
gouraudMaterial.needsUpdate = true;
});

// LOAD OBJs
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
    object.parent = floor;
    scene.add(object);

  }, onProgress, onError);
}

// CREATE SPHERES
var sphere = new THREE.SphereGeometry(1, 16, 16);
var gem_gouraud = new THREE.Mesh(sphere, gouraudMaterial); // tip: make different materials for each sphere
gem_gouraud.position.set(-3, 1, -1);
scene.add(gem_gouraud);
gem_gouraud.parent = floor;

var gem_phong = new THREE.Mesh(sphere, phongMaterial);
gem_phong.position.set(-1, 1, -1);
scene.add(gem_phong);
gem_phong.parent = floor;

var gem_phong_blinn = new THREE.Mesh(sphere, bPhongMaterial);
gem_phong_blinn.position.set(1, 1, -1);
scene.add(gem_phong_blinn);
gem_phong_blinn.parent = floor;

var gem_texture = new THREE.Mesh(sphere, textureMaterial);
gem_texture.position.set(3, 1, -1);
scene.add(gem_texture);
gem_texture.parent = floor;

var secondLight = true;


// SETUP UPDATE CALL-BACK
var keyboard = new THREEx.KeyboardState();

//Pour jouer avec la seconde lumière!
function checkKeyboard() {

//Ajouter ou retirer la seconde lumière
        if (keyboard.pressed('1')) {
            gem_gouraud.material = gouraudMaterial;
            gem_gouraud.position.set(-3, 1, -1);
            scene.add(gem_gouraud);
            gem_gouraud.parent = floor;

            secondLight = false;
        }

         else if(keyboard.pressed('2')){
                gem_gouraud.material =gouraudMaterial2;
                gem_gouraud.position.set(-3, 1, -1);
                scene.add(gem_gouraud);
                gem_gouraud.parent = floor;

                secondLight = true;
            }

        else if(keyboard.pressed('3')){
            gem_gouraud.material = gouraudMaterial3;
            gem_gouraud.position.set(-3, 1, -1);
            scene.add(gem_gouraud);
            gem_gouraud.parent = floor;

            secondLight = false;
        }

 //Faire déplacer la seconde lumière si elle est présente
    if(secondLight == true) {
        if (keyboard.pressed("W"))
            lightDirection2.z += 0.1;
        else if (keyboard.pressed("S"))
            lightDirection2.z -= 0.1;

        if (keyboard.pressed("A"))
            lightDirection2.x += 0.1;
        else if (keyboard.pressed("D"))
            lightDirection2.x -= 0.1;

        if (keyboard.pressed("R"))
            lightDirection2.y += 0.1;
        else if (keyboard.pressed("F"))
            lightDirection2.y -= 0.1;
    }

}


var render = function() {
 checkKeyboard();
 requestAnimationFrame(render);
 renderer.render(scene, camera);
};

render();
