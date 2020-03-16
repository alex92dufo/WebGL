/**
 * UdeM IFT 3355, H20
 * TP 2 Template
 * Mise à jour par: Alexandre Dufour (p1054564)
 */

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix = a;
  this.matrix.decompose(this.position, this.quaternion, this.scale);
};

// SETUP RENDERER AND SCENE
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);

var worldFrame = new THREE.AxisHelper(5);
scene.add(worldFrame);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(10,5,10);
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
floor.rotation.x = Math.PI / 2;
floor.position.y -= 1;
scene.add(floor);


class Robot {
  constructor() {
    this.bodyHeight = 1;
    this.bodyWidth = 0.8;
    this.bodyDepth = 0.65;

    this.neckHeight = 0.25;

    this.headRadius = 0.5;

    //Upper Leg
    this.upperLegHeight = 0.3;
    this.upperLegRadius = 0.15;

    //Lower Leg
    this.lowerLegHeight = 0.5;
    this.lowerLegRadius = 0.10;

    //Foot
    this.footSize = 0.4;
    this.footHeight = 0.05;
    this.footWidth = 0.2;

    //Arm
    this.armLength = 1;
    this.armRadius = 0.1;

    // Material -- Pour essayer de faire bouger le robot avec les touches du clavier
    this.robotPosition = {type: 'v3', value: new THREE.Vector3(0,0,0)};
    this.material = new THREE.ShaderMaterial( {
      uniforms: {
      robotPosition: this.robotPosition,
    }
    });

    // Initial pose
    this.initialize()
  }


  initialize() {
    // Torso geometry
    var torsoGeometry = new THREE.CubeGeometry(this.bodyWidth, this.bodyHeight, this.bodyDepth);
    if (!this.hasOwnProperty("torso"))
      this.torso = new THREE.Mesh(torsoGeometry, this.material);

    // Neck geometry
    var neckGeometry = new THREE.CylinderGeometry(0.15, 0.15, this.neckHeight, 64);
    if (!this.hasOwnProperty("neck"))
      this.neck = new THREE.Mesh(neckGeometry, this.material);

    // Head geometry
    var headGeometry = new THREE.SphereGeometry(this.headRadius, 64, 3);
    if (!this.hasOwnProperty("head"))
      this.head = new THREE.Mesh(headGeometry, this.material);

    //UpperLeg geometry
    var upperLegGeometry = new THREE.CylinderGeometry(this.upperLegRadius, this.upperLegRadius, this.upperLegHeight, 64);
    if (!this.hasOwnProperty("LULeg"))
      this.leftUpperLeg = new THREE.Mesh(upperLegGeometry, this.material);
    if (!this.hasOwnProperty("RULeg"))
      this.rightUpperLeg = new THREE.Mesh(upperLegGeometry, this.material);

    //LowerLeg geometry
    var lowerLegGeometry = new THREE.CylinderGeometry(this.lowerLegRadius, this.lowerLegRadius, this.lowerLegHeight, 64);
    if (!this.hasOwnProperty("LLLeg"))
      this.leftLowerLeg = new THREE.Mesh(lowerLegGeometry, this.material);
    if (!this.hasOwnProperty("RLLeg"))
      this.rightLowerLeg = new THREE.Mesh(lowerLegGeometry, this.material);

    //Foot geometry
    var footGeometry = new THREE.CubeGeometry(this.footWidth, this.footHeight, this.footSize);
    if (!this.hasOwnProperty("LFoot"))
      this.leftFoot = new THREE.Mesh(footGeometry, this.material);
    if (!this.hasOwnProperty("RFoot"))
      this.rightFoot = new THREE.Mesh(footGeometry, this.material);

    //Arm geometry
    var ArmGeometry = new THREE.CylinderGeometry(this.armRadius, this.armRadius, this.armLength, 64);
    if (!this.hasOwnProperty("lARM"))
      this.leftArm = new THREE.Mesh(ArmGeometry, this.material);
    if (!this.hasOwnProperty("RLLeg"))
      this.rightArm= new THREE.Mesh(ArmGeometry, this.material);

    // Torso matrix
    this.torsoMatrix = new THREE.Matrix4().set(
		1, 0, 0, 0,
		0, 1, 0, this.bodyHeight/2,
		0, 0, 1, 0,
		0, 0, 0, 1
    );

    // Neck matrix
    this.neckMatrix = new THREE.Matrix4().set(
		1, 0, 0, 0,
		0, 1, 0, this.bodyHeight/2 + this.neckHeight/2,
		0, 0, 1, 0,
		0, 0, 0, 1
    );
    var neckMatrix = new THREE.Matrix4().multiplyMatrices(this.torsoMatrix, this.neckMatrix);

    // Head matrix
    this.headMatrix = new THREE.Matrix4().set(
		1, 0, 0, 0,
		0, 1, 0, this.neckHeight/2 + this.headRadius,
		0, 0, 1, 0,
		0, 0, 0, 1
    );
    var headMatrix = new THREE.Matrix4().multiplyMatrices(neckMatrix, this.headMatrix);

    //Left Upper Leg matrix
    this.lUpperLegMatrix = new THREE.Matrix4().set(
        1, 0, 0, -this.bodyWidth/2 + this.upperLegRadius,
        0, 1, 0, -this.bodyHeight/2 - this.upperLegHeight/2,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
    var lUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(this.torsoMatrix, this.lUpperLegMatrix);


    //Right Upper Leg matrix
    this.rUpperLegMatrix = new THREE.Matrix4().set(
        1, 0, 0, this.bodyWidth/2 - this.upperLegRadius,
        0, 1, 0, -this.bodyHeight/2 - this.upperLegHeight/2,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
    var rUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(this.torsoMatrix, this.rUpperLegMatrix);


    //Left lower leg matrix
    this.lLowerLegMatrix = new THREE.Matrix4().set(
        1, 0, 0, -this.upperLegRadius + this.lowerLegRadius,
        0, 1, 0, -this.upperLegHeight/2 - this.lowerLegHeight/2,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
    var lLowerLegMatrix = new THREE.Matrix4().multiplyMatrices(lUpperLegMatrix, this.lLowerLegMatrix);


    //Right lower leg matrix
    this.rLowerLegMatrix = new THREE.Matrix4().set(
        1, 0, 0, this.upperLegRadius - this.lowerLegRadius,
        0, 1, 0, -this.upperLegHeight/2 - this.lowerLegHeight/2,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
    var rLowerLegMatrix = new THREE.Matrix4().multiplyMatrices(rUpperLegMatrix, this.rLowerLegMatrix);

    //Left foot
    this.lFootMatrix = new THREE.Matrix4().set(
        1, 0, 0, this.lowerLegRadius - this.footWidth/2,
        0, 1, 0, -this.lowerLegHeight/2 - this.footHeight/2,
        0, 0, 1, this.footSize/3,
        0, 0, 0, 1
    );
    var lFootMatrix = new THREE.Matrix4().multiplyMatrices(lLowerLegMatrix, this.lFootMatrix);

    //Right foot
    this.rFootMatrix = new THREE.Matrix4().set(
        1, 0, 0, this.lowerLegRadius - this.footWidth/2,
        0, 1, 0, -this.lowerLegHeight/2 - this.footHeight/2,
        0, 0, 1, this.footSize/3,
        0, 0, 0, 1
    );
    var rFootMatrix = new THREE.Matrix4().multiplyMatrices(rLowerLegMatrix, this.rFootMatrix);

    //Left Arm matrix
    this.lArmMatrix = new THREE.Matrix4().set(
        1, 0, 0, -this.bodyWidth/2 - this.armRadius,
        0, 1, 0, this.bodyHeight/2-this.armLength/2,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
    var lArmMatrix = new THREE.Matrix4().multiplyMatrices(this.torsoMatrix, this.lArmMatrix);


    //Right Arm matrix
    this.rArmMatrix = new THREE.Matrix4().set(
        1, 0, 0, this.bodyWidth/2 + this.armRadius,
        0, 1, 0, this.bodyHeight/2-this.armLength/2,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
    var rArmMatrix = new THREE.Matrix4().multiplyMatrices(this.torsoMatrix, this.rArmMatrix);


    // Apply transformation
    this.torso.setMatrix(this.torsoMatrix);
    if (scene.getObjectById(this.torso.id) === undefined)
      scene.add(this.torso);

    this.neck.setMatrix(neckMatrix);
    if (scene.getObjectById(this.neck.id) === undefined)
      scene.add(this.neck);

    this.head.setMatrix(headMatrix);
    if (scene.getObjectById(this.head.id) === undefined)
      scene.add(this.head);

    this.leftUpperLeg.setMatrix(lUpperLegMatrix);
    if (scene.getObjectById(this.leftUpperLeg.id) === undefined)
      scene.add(this.leftUpperLeg);

    this.rightUpperLeg.setMatrix(rUpperLegMatrix);
    if (scene.getObjectById(this.rightUpperLeg.id) === undefined)
      scene.add(this.rightUpperLeg);

    this.leftLowerLeg.setMatrix(lLowerLegMatrix);
    if (scene.getObjectById(this.leftLowerLeg.id) === undefined)
      scene.add(this.leftLowerLeg);

    this.rightLowerLeg.setMatrix(rLowerLegMatrix);
    if (scene.getObjectById(this.rightLowerLeg.id) === undefined)
      scene.add(this.rightLowerLeg);

    this.leftFoot.setMatrix(lFootMatrix);
    if (scene.getObjectById(this.leftFoot.id) === undefined)
      scene.add(this.leftFoot);

    this.rightFoot.setMatrix(rFootMatrix);
    if (scene.getObjectById(this.rightFoot.id) === undefined)
      scene.add(this.rightFoot);

    this.leftArm.setMatrix(lArmMatrix);
    if (scene.getObjectById(this.leftArm.id) === undefined)
      scene.add(this.leftArm);

    this.rightArm.setMatrix(rArmMatrix);
    if (scene.getObjectById(this.rightArm.id) === undefined)
      scene.add(this.rightArm);
  }

  animate(t) {
    this.originalPosition()
    /****Left leg****/
    //Left upper leg
    var rotationLeg;
    var rotationArm;
    var angle = (t) % Math.PI;
    if(-1 < Math.cos(angle) && Math.cos(angle) <= 0 )
    {
      rotationLeg = new THREE.Matrix4().set(
          1, 0, 0, -this.bodyWidth/2 + this.upperLegRadius,
          0, Math.cos(angle), -Math.sin(angle), -this.bodyHeight/2 - this.upperLegHeight/2,
          0, Math.sin(angle), Math.cos(angle), 0,
          0, 0, 0, 1
      );
      rotationArm = new THREE.Matrix4().set(
          1, 0, 0, this.bodyWidth/2 + this.armRadius,
          0, Math.cos(angle+Math.sqrt(3)/2), -Math.sin(angle+Math.sqrt(3)/2), this.bodyHeight/2-this.armLength/2,
          0, Math.sin(angle+Math.sqrt(3)/2), Math.cos(angle+Math.sqrt(3)/2), (this.armLength/2)*Math.cos(angle-Math.sqrt(3)/2),
          0, 0, 0, 1
      );
    }
    else {
      rotationLeg = new THREE.Matrix4().set(
          1, 0, 0, -this.bodyWidth / 2 + this.upperLegRadius,
          0, Math.cos(angle), Math.sin(angle), -this.bodyHeight / 2 - this.upperLegHeight / 2,
          0, -Math.sin(angle), Math.cos(angle), 0,
          0, 0, 0, 1
      );
      rotationArm = new THREE.Matrix4().set(
          1, 0, 0, this.bodyWidth/2 + this.armRadius,
          0, Math.cos(angle-Math.sqrt(3)/2), Math.sin(angle-Math.sqrt(3)/2), this.bodyHeight/2-this.armLength/2,
          0, -Math.sin(angle-Math.sqrt(3)/2), Math.cos(angle-Math.sqrt(3)/2), (-this.armLength/2)*Math.cos(angle+Math.sqrt(3)/2),
          0, 0, 0, 1
      );
    }

    var lUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(this.torso.matrix, rotationLeg);
    this.leftUpperLeg.setMatrix(lUpperLegMatrix);

    var rArmMatrix = new THREE.Matrix4().multiplyMatrices(this.torso.matrix, rotationArm);
    this.rightArm.setMatrix(rArmMatrix);

    //left lower leg
    var rotation;
    var angle = (t) % Math.PI;
    if(0 < Math.cos(angle) && Math.cos(angle) <= 1 )
    {
      rotation = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, Math.cos(angle), -Math.sin(angle), -this.upperLegHeight/2 - this.lowerLegHeight/2,
          0, Math.sin(angle), Math.cos(angle), 0,
          0, 0, 0, 1
      );
    }
    else
      rotation = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, Math.cos(angle), Math.sin(angle), this.upperLegHeight/2 + this.lowerLegHeight/2,
          0, -Math.sin(angle), Math.cos(angle), 0,
          0, 0, 0, 1
      );

    var lLowerLegMatrix = new THREE.Matrix4().multiplyMatrices(this.leftUpperLeg.matrix, rotation);
    this.leftLowerLeg.setMatrix(lLowerLegMatrix);

    //Left foot
    var lFootMatrix = new THREE.Matrix4().multiplyMatrices(this.leftLowerLeg.matrix, this.lFootMatrix);
    this.leftFoot.setMatrix(lFootMatrix);

    /****right leg****/
        //right upper leg
    var rotation;
    var angle = (t+Math.PI/2) % Math.PI;
    if(-1 < Math.cos(angle) && Math.cos(angle) <= 0 )
    {
      rotation = new THREE.Matrix4().set(
          1, 0, 0, this.bodyWidth/2 - this.upperLegRadius,
          0, Math.cos(angle), -Math.sin(angle), -this.bodyHeight/2 - this.upperLegHeight/2,
          0, Math.sin(angle), Math.cos(angle), 0,
          0, 0, 0, 1
      );
      rotationArm = new THREE.Matrix4().set(
          1, 0, 0, -this.bodyWidth/2 - this.armRadius,
          0, Math.cos(angle+Math.sqrt(3)/2), -Math.sin(angle+Math.sqrt(3)/2), this.bodyHeight/2-this.armLength/2,
          0, Math.sin(angle+Math.sqrt(3)/2), Math.cos(angle+Math.sqrt(3)/2), (this.armLength/2)*Math.cos(angle-Math.sqrt(3)/2),
          0, 0, 0, 1
      );
    }
    else {
      rotation = new THREE.Matrix4().set(
          1, 0, 0, this.bodyWidth / 2 - this.upperLegRadius,
          0, Math.cos(angle), Math.sin(angle), -this.bodyHeight / 2 - this.upperLegHeight / 2,
          0, -Math.sin(angle), Math.cos(angle), 0,
          0, 0, 0, 1
      );
      rotationArm = new THREE.Matrix4().set(
          1, 0, 0, -this.bodyWidth / 2 - this.armRadius,
          0, Math.cos(angle - Math.sqrt(3)/2), Math.sin(angle - Math.sqrt(3)/2), this.bodyHeight / 2 - this.armLength / 2,
          0, -Math.sin(angle - Math.sqrt(3)/2), Math.cos(angle - Math.sqrt(3)/2), (-this.armLength / 2) * Math.cos(angle + Math.sqrt(3)/2),
          0, 0, 0, 1
      );
    }

    var rUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(this.torso.matrix, rotation);
    this.rightUpperLeg.setMatrix(rUpperLegMatrix);

    var lArmMatrix = new THREE.Matrix4().multiplyMatrices(this.torso.matrix, rotationArm);
    this.leftArm.setMatrix(lArmMatrix);

    //right lower leg
    var rotation;
    var angle = (t+Math.PI/2) % Math.PI;
    if(0 < Math.cos(angle) && Math.cos(angle) <= 1 )
    {
      rotation = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, Math.cos(angle), -Math.sin(angle), -this.upperLegHeight/2 - this.lowerLegHeight/2,
          0, Math.sin(angle), Math.cos(angle), 0,
          0, 0, 0, 1
      );
    }
    else
      rotation = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, Math.cos(angle), Math.sin(angle), this.upperLegHeight/2 + this.lowerLegHeight/2,
          0, -Math.sin(angle), Math.cos(angle), 0,
          0, 0, 0, 1
      );

    var rLowerLegMatrix = new THREE.Matrix4().multiplyMatrices(this.rightUpperLeg.matrix, rotation);
    this.rightLowerLeg.setMatrix(rLowerLegMatrix);

    //right foot
    var rFootMatrix = new THREE.Matrix4().multiplyMatrices(this.rightLowerLeg.matrix, this.rFootMatrix);
    this.rightFoot.setMatrix(rFootMatrix);

  }

  originalPosition(){
    this.torso.setMatrix(this.torsoMatrix);

    var neckMatrix = new THREE.Matrix4().multiplyMatrices(this.torso.matrix, this.neckMatrix);
    this.neck.setMatrix(neckMatrix);

    var headMatrix = new THREE.Matrix4().multiplyMatrices(this.neck.matrix, this.headMatrix);
    this.head.setMatrix(headMatrix);

    var lUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(this.torso.matrix, this.lUpperLegMatrix);
    this.leftUpperLeg.setMatrix(lUpperLegMatrix);

    var lLowerLegMatrix = new THREE.Matrix4().multiplyMatrices(this.leftUpperLeg.matrix, this.lLowerLegMatrix);
    this.leftLowerLeg.setMatrix(lLowerLegMatrix);

    var lFootMatrix = new THREE.Matrix4().multiplyMatrices(this.leftLowerLeg.matrix, this.lFootMatrix);
    this.leftFoot.setMatrix(lFootMatrix);

    var rUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(this.torso.matrix, this.rUpperLegMatrix);
    this.rightUpperLeg.setMatrix(rUpperLegMatrix);

    var rLowerLegMatrix = new THREE.Matrix4().multiplyMatrices(this.rightUpperLeg.matrix, this.rLowerLegMatrix);
    this.rightLowerLeg.setMatrix(rLowerLegMatrix);

    var rFootMatrix = new THREE.Matrix4().multiplyMatrices(this.rightLowerLeg.matrix, this.rFootMatrix);
    this.rightFoot.setMatrix(rFootMatrix);

    var lArmMatrix = new THREE.Matrix4().multiplyMatrices(this.torso.matrix, this.lArmMatrix);
    this.leftArm.setMatrix(lArmMatrix);
    
    var rArmMatrix = new THREE.Matrix4().multiplyMatrices(this.torso.matrix, this.rArmMatrix);
    this.rightArm.setMatrix(rArmMatrix);
  }
}

//Transform degree to rads
function degToRad(deg){
  return deg*Math.PI/180;
}

//Shaders pour pouvoir bouger le robot avec les touches du clavier
var shaderFiles = [
  'glsl/robot.vs.glsl',
  'glsl/robot.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  robot.material.vertexShader = shaders['glsl/robot.vs.glsl'];
  robot.material.fragmentShader = shaders['glsl/robot.fs.glsl'];
})

var robot = new Robot();


// APPLY DIFFERENT EFFECTS TO DIFFERENT CHANNELS
var clock = new THREE.Clock(true);
function updateBody() {
  switch(channel) {
    // animation
    case 0:
      var t = clock.getElapsedTime();
      robot.animate(t);
      break;

    // add poses here:
      //Jean-Claude Van Dam
    case 1:
      robot.originalPosition();
      /**Left leg**/
      //Upper
      var rad = degToRad(-90);
      var transform = new THREE.Matrix4().set(
          Math.cos(rad), -Math.sin(rad), 0, -robot.bodyWidth/2-robot.upperLegHeight/2,
          Math.sin(rad), Math.cos(rad), 0, -robot.bodyHeight/2,
          0,0 , 1, 0,
          0, 0, 0, 1
      );
      var lUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, transform);
      robot.leftUpperLeg.setMatrix(lUpperLegMatrix);

      //lower
      var transform = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, 1, 0, -robot.upperLegHeight/2 - robot.lowerLegHeight/2,
          0, 0, 1, 0,
          0, 0, 0, 1
      );
      var llowerLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.leftUpperLeg.matrix, transform);
      robot.leftLowerLeg.setMatrix(llowerLegMatrix);

      //foot
      var lFootMatrix = new THREE.Matrix4().multiplyMatrices(robot.leftLowerLeg.matrix, robot.lFootMatrix);
      robot.leftFoot.setMatrix(lFootMatrix);

      /**Right leg**/
          //Upper
      var rad = degToRad(90);
      var transform = new THREE.Matrix4().set(
          Math.cos(rad), -Math.sin(rad), 0, robot.bodyWidth/2 + robot.upperLegHeight/2,
          Math.sin(rad), Math.cos(rad), 0, -robot.bodyHeight/2,
          0,0 , 1, 0,
          0, 0, 0, 1
      );
      var rUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, transform);
      robot.rightUpperLeg.setMatrix(rUpperLegMatrix);

      //lower
      var transform = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, 1, 0, -robot.upperLegHeight/2 - robot.lowerLegHeight/2,
          0, 0, 1, 0,
          0, 0, 0, 1
      );
      var rlowerLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.rightUpperLeg.matrix, transform);
      robot.rightLowerLeg.setMatrix(rlowerLegMatrix);

      //foot
      var rFootMatrix = new THREE.Matrix4().multiplyMatrices(robot.rightLowerLeg.matrix, robot.rFootMatrix);
      robot.rightFoot.setMatrix(rFootMatrix);

      //left Arm
      var lArmMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.lArmMatrix);
      robot.leftArm.setMatrix(lArmMatrix);

      //right Arm
      var rArmMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.rArmMatrix);
      robot.rightArm.setMatrix(rArmMatrix);
      break;

      //A genoux
    case 2:
      robot.originalPosition();

      var torsoMatrix = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0,1, 0, robot.bodyHeight/2 - 0.5 ,
          0, 0, 1, 0,
          0, 0, 0, 1
      );
      robot.torso.setMatrix(torsoMatrix);

      // Neck matrix
      var neckMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.neckMatrix);
      robot.neck.setMatrix(neckMatrix);

      //Head matrix
      var headMatrix = new THREE.Matrix4().multiplyMatrices(robot.neck.matrix, robot.headMatrix);
      robot.head.setMatrix(headMatrix);

      /**Left leg**/
          //Upper
      var rad = degToRad(90);
      var transform = new THREE.Matrix4().set(
          1, 0, 0, -robot.bodyWidth/2 + robot.upperLegRadius,
          0, Math.cos(rad), -Math.sin(rad), -robot.bodyHeight/2,
          0,Math.sin(rad), Math.cos(rad), robot.bodyWidth/2 + robot.upperLegHeight/2,
          0, 0, 0, 1
      );
      var lUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, transform);
      robot.leftUpperLeg.setMatrix(lUpperLegMatrix);

      //lower
        var rad = degToRad(-90)
      var transform = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, Math.cos(rad), -Math.sin(rad), robot.upperLegHeight/2,
          0,Math.sin(rad), Math.cos(rad), robot.upperLegRadius,
          0, 0, 0, 1
      );
      var llowerLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.leftUpperLeg.matrix,  transform);
      robot.leftLowerLeg.setMatrix(llowerLegMatrix);

      //foot
      var lFootMatrix = new THREE.Matrix4().multiplyMatrices(robot.leftLowerLeg.matrix, robot.lFootMatrix);
      robot.leftFoot.setMatrix(lFootMatrix);

      /**Right leg**/
          //Upper
      var transform = new THREE.Matrix4().set(
          1, 0, 0, robot.bodyWidth/2 - robot.upperLegRadius,
          0, 1, 0, -robot.bodyHeight/2 - robot.upperLegHeight/2,
          0,0, 1, 0,
          0, 0, 0, 1
      );
      var rUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, transform);
      robot.rightUpperLeg.setMatrix(rUpperLegMatrix);

      //lower
      var rad = degToRad(120)
      var transform = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, Math.cos(rad), -Math.sin(rad), -robot.upperLegHeight/2,
          0,Math.sin(rad), Math.cos(rad), -robot.upperLegRadius,
          0, 0, 0, 1
      );
      var rlowerLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.rightUpperLeg.matrix,  transform);
      robot.rightLowerLeg.setMatrix(rlowerLegMatrix);

      //foot
      var rFootMatrix = new THREE.Matrix4().multiplyMatrices(robot.rightLowerLeg.matrix, robot.rFootMatrix);
      robot.rightFoot.setMatrix(rFootMatrix);

      //left Arm
      var lArmMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.lArmMatrix);
      robot.leftArm.setMatrix(lArmMatrix);

      //right Arm
      var rArmMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.rArmMatrix);
      robot.rightArm.setMatrix(rArmMatrix);
      break;

      //Jump
    case 3:
      robot.originalPosition();

      jumpAngle = degToRad(-20);
      var torsoMatrix = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, Math.cos(jumpAngle), -Math.sin(jumpAngle), robot.bodyHeight/2 + 2 ,
          0, Math.sin(jumpAngle), Math.cos(jumpAngle), 0,
          0, 0, 0, 1
      );

      robot.torso.setMatrix(torsoMatrix);

      // Neck matrix
      var neckMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.neckMatrix);
      robot.neck.setMatrix(neckMatrix);
      //Head matrix
      var headMatrix = new THREE.Matrix4().multiplyMatrices(robot.neck.matrix, robot.headMatrix);
      robot.head.setMatrix(headMatrix);

      /**Left leg**/
          //Upper
      var rad = degToRad(110);
      var transform = new THREE.Matrix4().set(
          1, 0, 0, -robot.bodyWidth/2 + robot.upperLegRadius,
          0, Math.cos(rad), -Math.sin(rad), -robot.bodyHeight/2 - robot.upperLegHeight/2,
          0,Math.sin(rad), Math.cos(rad), robot.bodyHeight/2,
          0, 0, 0, 1
      );
      var lUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, transform);
      robot.leftUpperLeg.setMatrix(lUpperLegMatrix);

      //Lower
      var rad = degToRad(225);
      var transform = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, Math.cos(rad), -Math.sin(rad), robot.upperLegHeight,
          0,Math.sin(rad), Math.cos(rad), robot.lowerLegRadius,
          0, 0, 0, 1
      );
      var llowerLegMatrix = new THREE.Matrix4().multiplyMatrices( robot.leftUpperLeg.matrix, transform);
      robot.leftLowerLeg.setMatrix(llowerLegMatrix);

      //foot
      var lFootMatrix = new THREE.Matrix4().multiplyMatrices(robot.leftLowerLeg.matrix, robot.lFootMatrix);
      robot.leftFoot.setMatrix(lFootMatrix);

      /**Right leg**/
          //Upper
      var rad = degToRad(200);
      var transform = new THREE.Matrix4().set(
          1, 0, 0, robot.bodyWidth/2 - robot.upperLegRadius,
          0, Math.cos(rad), -Math.sin(rad), -robot.bodyHeight/2 - robot.upperLegHeight/2,
          0,Math.sin(rad), Math.cos(rad), 0,
          0, 0, 0, 1
      );
      var rUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, transform);
      robot.rightUpperLeg.setMatrix(rUpperLegMatrix);

      //Lower
      var rad = degToRad(225);
      var transform = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, Math.cos(rad), -Math.sin(rad), robot.upperLegHeight,
          0,Math.sin(rad), Math.cos(rad), robot.lowerLegRadius,
          0, 0, 0, 1
      );
      var rlowerLegMatrix = new THREE.Matrix4().multiplyMatrices( robot.rightUpperLeg.matrix, transform);
      robot.rightLowerLeg.setMatrix(rlowerLegMatrix);

      //foot
      var rFootMatrix = new THREE.Matrix4().multiplyMatrices(robot.rightLowerLeg.matrix, robot.rFootMatrix);
      robot.rightFoot.setMatrix(rFootMatrix);

      //left Arm
      var lArmMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.lArmMatrix);
      robot.leftArm.setMatrix(lArmMatrix);

      //right Arm
      var rArmMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.rArmMatrix);
      robot.rightArm.setMatrix(rArmMatrix);
      break;

      //karate kick
    case 4:
      robot.originalPosition();

      /**Torso**/
      var rad = degToRad(45);
      var transform = new THREE.Matrix4().set(
          Math.cos(rad), 0, Math.sin(rad), 0,
          0, 1, 0, robot.bodyHeight/2,
          -Math.sin(rad), 0 , Math.cos(rad), 0,
          0, 0, 0, 1
      );

      var rad = degToRad(-15);
      var transform2 = new THREE.Matrix4().set(
          Math.cos(rad), -Math.sin(rad), 0, 0,
          Math.sin(rad), Math.cos(rad), 0, 0,
          0, 0 , 1, 0,
          0, 0, 0, 1
      );
      var torsoMatrix = new THREE.Matrix4().multiplyMatrices(transform2, transform);
      robot.torso.setMatrix(torsoMatrix);

      /**Left leg**/
          //Upper
      var rad = degToRad(-90);
      var transform = new THREE.Matrix4().set(
          Math.cos(rad), -Math.sin(rad), 0, -robot.bodyWidth/2 - robot.upperLegHeight/2,
          Math.sin(rad), Math.cos(rad), 0, -robot.bodyHeight/2,
          0,0 , 1, 0,
          0, 0, 0, 1
      );

      var rad = degToRad(45);
      var transform2 = new THREE.Matrix4().set(
          Math.cos(rad), 0, Math.sin(rad), 0,
          0, 1, 0, 0,
          -Math.sin(rad), 0 , Math.cos(rad), 0,
          0, 0, 0, 1
      );
      var lUpperLegRotation = new THREE.Matrix4().multiplyMatrices(transform2, transform);
      var lUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, lUpperLegRotation);
      robot.leftUpperLeg.setMatrix(lUpperLegMatrix);

      //lower
      var transform = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, 1, 0, -robot.upperLegHeight/2 - robot.lowerLegHeight/2,
          0, 0, 1, 0,
          0, 0, 0, 1
      );
      var llowerLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.leftUpperLeg.matrix, transform);
      robot.leftLowerLeg.setMatrix(llowerLegMatrix);

      //foot
      var lFootMatrix = new THREE.Matrix4().multiplyMatrices(robot.leftLowerLeg.matrix, robot.lFootMatrix);
      robot.leftFoot.setMatrix(lFootMatrix);

      /**Right leg**/
      var transform = new THREE.Matrix4().set(
          1, 0, 0, robot.bodyWidth/2 - robot.upperLegRadius,
          0, 1, 0, -robot.bodyHeight/2 - robot.upperLegHeight/2,
          0, 0 , 1, 0,
          0, 0, 0, 1
      );
      var rUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, transform);
      robot.rightUpperLeg.setMatrix(rUpperLegMatrix);

      //lower
      var transform = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, 1, 0, -robot.upperLegHeight/2 - robot.lowerLegHeight/2,
          0, 0, 1, 0,
          0, 0, 0, 1
      );
      var rlowerLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.rightUpperLeg.matrix, transform);
      robot.rightLowerLeg.setMatrix(rlowerLegMatrix);

      //foot
      var rFootMatrix = new THREE.Matrix4().multiplyMatrices(robot.rightLowerLeg.matrix, robot.rFootMatrix);
      robot.rightFoot.setMatrix(rFootMatrix);

      // Neck matrix
      var neckMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.neckMatrix);
      robot.neck.setMatrix(neckMatrix);
      //Head matrix
      var headMatrix = new THREE.Matrix4().multiplyMatrices(robot.neck.matrix, robot.headMatrix);
      robot.head.setMatrix(headMatrix);

      //left Arm
      var lArmMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.lArmMatrix);
      robot.leftArm.setMatrix(lArmMatrix);

      //right Arm
      var rArmMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.rArmMatrix);
      robot.rightArm.setMatrix(rArmMatrix);
      break;

    case 5:
      robot.originalPosition();

      /**Torso**/
      var torsoMatrix = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0,1, 0, robot.bodyHeight/2 - 0.75 ,
          0, 0, 1, 0,
          0, 0, 0, 1
      );

      robot.torso.setMatrix(torsoMatrix);
      // Neck matrix
      var neckMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.neckMatrix);
      robot.neck.setMatrix(neckMatrix);
      //Head matrix
      var headMatrix = new THREE.Matrix4().multiplyMatrices(robot.neck.matrix, robot.headMatrix);
      robot.head.setMatrix(headMatrix);


      /**Left leg**/
          //Upper
      var rad = degToRad(90);
      var transform = new THREE.Matrix4().set(
          Math.cos(rad), -Math.sin(rad), 0, -robot.bodyWidth/2 - robot.upperLegHeight/2,
          Math.sin(rad), Math.cos(rad), 0, -robot.bodyHeight/2,
          0,0 , 1, 0,
          0, 0, 0, 1
      );

      var rad = degToRad(45);
      var transform2 = new THREE.Matrix4().set(
          Math.cos(rad), 0, Math.sin(rad), 0,
          0, 1, 0, 0,
          -Math.sin(rad), 0 , Math.cos(rad), 0,
          0, 0, 0, 1
      );
      var lUpperLegRotation = new THREE.Matrix4().multiplyMatrices(transform2, transform);
      var lUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, lUpperLegRotation);
      robot.leftUpperLeg.setMatrix(lUpperLegMatrix);

      //lower
        var rad = degToRad(90);
      var transform = new THREE.Matrix4().set(
          Math.cos(rad), 0, Math.sin(rad), 0,
          0, 1, 0, 0,
          -Math.sin(rad), 0 , Math.cos(rad), 0,
          0, 0, 0, 1
      );

      var rad = degToRad(-90);
      var transform2 = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, Math.cos(rad), -Math.sin(rad), robot.upperLegHeight/2,
          0, Math.sin(rad), Math.cos(rad), robot.lowerLegHeight/2,
          0, 0, 0, 1
      );
      var llowerLegRotation = new THREE.Matrix4().multiplyMatrices(transform2, transform);
      var llowerLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.leftUpperLeg.matrix, llowerLegRotation);
      robot.leftLowerLeg.setMatrix(llowerLegMatrix);

      //foot
      var lFootMatrix = new THREE.Matrix4().multiplyMatrices(robot.leftLowerLeg.matrix, robot.lFootMatrix);
      robot.leftFoot.setMatrix(lFootMatrix);

      /**Right leg**/
          //Upper
      var rad = degToRad(90);
      var transform = new THREE.Matrix4().set(
          Math.cos(rad), -Math.sin(rad), 0, -robot.bodyWidth/2 - robot.upperLegHeight/2,
          Math.sin(rad), Math.cos(rad), 0, -robot.bodyHeight/2,
          0,0 , 1, 0,
          0, 0, 0, 1
      );

      var rad = degToRad(135);
      var transform2 = new THREE.Matrix4().set(
          Math.cos(rad), 0, Math.sin(rad), 0,
          0, 1, 0, 0,
          -Math.sin(rad), 0 , Math.cos(rad), 0,
          0, 0, 0, 1
      );
      var rUpperLegRotation = new THREE.Matrix4().multiplyMatrices(transform2, transform);
      var rUpperLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, rUpperLegRotation);
      robot.rightUpperLeg.setMatrix(rUpperLegMatrix);

      //lower
      var rad = degToRad(90);
      var transform = new THREE.Matrix4().set(
          Math.cos(rad), 0, Math.sin(rad), 0,
          0, 1, 0, 0,
          -Math.sin(rad), 0 , Math.cos(rad), 0,
          0, 0, 0, 1
      );

      var rad = degToRad(90);
      var transform2 = new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, Math.cos(rad), -Math.sin(rad), robot.upperLegHeight/2,
          0, Math.sin(rad), Math.cos(rad), -robot.lowerLegHeight/2,
          0, 0, 0, 1
      );
      var rlowerLegRotation = new THREE.Matrix4().multiplyMatrices(transform2, transform);
      var rlowerLegMatrix = new THREE.Matrix4().multiplyMatrices(robot.rightUpperLeg.matrix, rlowerLegRotation);
      robot.rightLowerLeg.setMatrix(rlowerLegMatrix);

      //foot
      var rFootMatrix = new THREE.Matrix4().multiplyMatrices(robot.rightLowerLeg.matrix, robot.rFootMatrix);
      robot.rightFoot.setMatrix(rFootMatrix);

      //left Arm
      var lArmMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.lArmMatrix);
      robot.leftArm.setMatrix(lArmMatrix);

      //right Arm
      var rArmMatrix = new THREE.Matrix4().multiplyMatrices(robot.torso.matrix, robot.rArmMatrix);
      robot.rightArm.setMatrix(rArmMatrix);

      break;

    case 6:
      robot.originalPosition();
      break;

    default:
      break;
  }
}

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var channel = 0;
function checkKeyboard() {

  if (keyboard.pressed("W"))
    robot.robotPosition.value.z -= 0.1;
  else if (keyboard.pressed("S"))
    robot.robotPosition.value.z += 0.1;

  if (keyboard.pressed("A"))
    robot.robotPosition.value.x -= 0.1;
  else if (keyboard.pressed("D"))
    robot.robotPosition.value.x += 0.1;

  if (keyboard.pressed("R"))
    robot.robotPosition.value.y += 0.1;
  else if (keyboard.pressed("F"))
    robot.robotPosition.value.y -= 0.1;

  robot.material.needsUpdate = true;

  for (var i = 0; i < 7; i++)
  {
    if (keyboard.pressed(i.toString()))
    {
      channel = i;
      break;
    }
  }


}


// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  updateBody();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

update();
