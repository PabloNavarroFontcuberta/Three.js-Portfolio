//import * as THREE from 'three'
import * as THREE from './build/three.module.js'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import {OBJLoader} from './jsm/loaders/OBJLoader.js'
import {GLTFLoader} from './jsm/loaders/GLTFLoader.js'
import Stats from './jsm/libs/stats.module.js'
import { GUI } from './jsm/libs/lil-gui.module.min.js'
import { FontLoader } from './jsm/loaders/FontLoader.js'
import { FBXLoader } from './jsm/loaders/FBXLoader.js'

// Get the modal
var modal = document.getElementById("myModal");
var loaderDiv = document.getElementById("loader");
var loaderText = document.getElementById("loaderText");
var modalText = document.getElementById("modalText");
var loadingObjectsArray = ['','city.obj','delorean.fbx','car.gbl','AmbientLight','flag.jpg','flagupv.jpg'];
var counter = 0;

function displayObjects() {
    if(counter === loadingObjectsArray.length - 1){
        counter = 0;
    }
    else {
        counter++;  
    }
    loaderText.innerHTML = "Loading " + loadingObjectsArray[counter];
}



//Loading function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
 }
 async function loadingObjects() {
    var myInterval = setInterval(function(){displayObjects()}, 1);   
       await sleep(3000)
        loaderDiv.style.display = "none";
        loaderText.style.display = "none";
        modalText.style.display = "block";
 }
 loadingObjects()

let car,backright,house,name,computer,flyingcar;
let modalOpen = true;
let test = false;
let camPosX = 0
let camPosY = 0.6
let camPosZ = -8.5

const keyControls = {

    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false

};
const scene = new THREE.Scene()

const backTexture = new THREE.TextureLoader().load('./textures/matrix.jpg')
scene.background = backTexture;

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.x = camPosX
camera.position.y = camPosY
camera.position.z = camPosZ
// const listener = new THREE.AudioListener();
// camera.add( listener );
// const sound = new THREE.Audio( listener );
// const audioLoader = new THREE.AudioLoader();
// audioLoader.load( './motor.mp3', function( buffer ) {
// 	sound.setBuffer( buffer );
// 	sound.setLoop( true );
// 	sound.setVolume( 0.2 );
	
// });


const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)



//COLUMNS
const colGeometry = new THREE.BoxGeometry(0.1, 2.5, 0.1 )
const colFlagGeometry = new THREE.BoxGeometry(0.05,3.68,0.07)
const colFlagMaterial = new THREE.MeshBasicMaterial({
    color: 0x00000
})
const colMaterial = new THREE.MeshBasicMaterial({
    color: 0x222222
})
const colRight1 = new THREE.Mesh(colGeometry, colMaterial)
colRight1.position.x = 1.5
colRight1.position.z = 10 
const colRight2 = new THREE.Mesh(colGeometry, colMaterial)
colRight2.position.x = 1.5
colRight2.position.z = 11.3
const colLeft1 = new THREE.Mesh(colGeometry, colMaterial)
colLeft1.position.x = -1.5
colLeft1.position.z = 10 
const colLeft2 = new THREE.Mesh(colGeometry, colMaterial)
colLeft2.position.x = -1.5
colLeft2.position.z = 11.3
const colFlag = new THREE.Mesh(colFlagGeometry, colFlagMaterial)
colFlag.position.x = 3
colFlag.position.z = -7
scene.add(colRight1)
scene.add(colRight2)
scene.add(colLeft1)
scene.add(colLeft2)
scene.add(colFlag)

//MIDDLE LINES
const geometry2 = new THREE.BoxGeometry(0.1, 0.001, 500 )
const material2 = new THREE.MeshBasicMaterial({
    color: 0xffffff
})
const lineRight = new THREE.Mesh(geometry2, material2)
lineRight.position.x = -1 
const lineLeft = new THREE.Mesh(geometry2, material2)
lineLeft.position.x = 1 
scene.add(lineRight)
scene.add(lineLeft)

const geometry = new THREE.BoxGeometry(0.1, 0.001, 2 )
const material = new THREE.MeshBasicMaterial({
    color: 0xffffff
})
const line = new THREE.Mesh(geometry, material)
line.position.z = -22
scene.add(line)


for (let i = 1; i < 50; i++) {
    window["line" + i] = line.clone();
    window["line" + i].position.z = (i-22)*3.3;

    scene.add(window["line" + i]);
  }


//  GROUND
const gt = new THREE.TextureLoader().load( './textures/concrete.jpg' );
const gg = new THREE.PlaneGeometry( 320, 640 );
const gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

const ground = new THREE.Mesh( gg, gm );
ground.rotation.x = - Math.PI / 2;
ground.material.map.repeat.set( 256, 256);
ground.material.map.wrapS = THREE.RepeatWrapping;
ground.material.map.wrapT = THREE.RepeatWrapping;
ground.material.map.encoding = THREE.sRGBEncoding;
// note that because the ground does not cast a shadow, .castShadow is left false
ground.receiveShadow = true;

scene.add( ground );

//Light
const ambientLight = new THREE.AmbientLight(0xFFFFFF,0.5)
scene.add(ambientLight)

// direction lights setup
const spotLight1 = new THREE.SpotLight(0xFAFFAD, 0.9);
spotLight1.position.set(-9, 120, -20);
spotLight1.castShadow = true;
const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1, 1, 0x00ff00);
scene.add(spotLight1);
for (let a = 1; a < 9; a++) {
    window["spotLight1" + a] = spotLight1.clone();
    window["spotLight1" + a].position.z = a*35;

    scene.add(window["spotLight1" + a]);
  }

  //Flag Cube
  const cubeGeometry = new THREE.BoxGeometry( 1.5, 0.75, 0.05 );
  
  function addImageBitmap() {

    new THREE.ImageBitmapLoader()
        .setOptions( { imageOrientation: 'flipY' } )
        .load( './textures/flag.jpg?' + performance.now(), function ( imageBitmap ) {

            const texture = new THREE.CanvasTexture( imageBitmap );
            const cubeMaterial = new THREE.MeshBasicMaterial( { map: texture } );

   
            const cubeFlag = new THREE.Mesh( cubeGeometry, cubeMaterial )
            cubeFlag.position.set( 3.8,1.5,-7 )
            scene.add(cubeFlag)
    

        }, function ( p ) {

            console.log( p );

        }, function ( e ) {

            console.log( e );

        } );

}
addImageBitmap()

//UPV Flag Cube
const cubeGeometry2 = new THREE.BoxGeometry( 1.5, 1.5, 0.05 );
  
function addImageBitmap2() {

  new THREE.ImageBitmapLoader()
      .setOptions( { imageOrientation: 'flipY' } )
      .load( './textures/flagupv.jpg?' + performance.now(), function ( imageBitmap ) {

          const texture = new THREE.CanvasTexture( imageBitmap );
          const cubeMaterial = new THREE.MeshBasicMaterial( { map: texture } );

 
          const cubeFlag = new THREE.Mesh( cubeGeometry2, cubeMaterial )
          cubeFlag.position.set( 5.65,1,-0.9 )
          cubeFlag.rotation.set(0,2.1 * Math.PI,0)
          scene.add(cubeFlag)
  

      }, function ( p ) {

          console.log( p );

      }, function ( e ) {

          console.log( e );

      } );

}
addImageBitmap2()



    //DELOREAN
    const fbxLoader = new FBXLoader()
    fbxLoader.load(
    './uploads_files_2027445_CyberpunkDeLorean.FBX',
    (object) => {
        //flyingcar = object;
        // object.traverse(function (child) {
        //     if (child.isMesh) {
        //         // // (child as THREE.Mesh).material = material
        //         // if ((child as THREE.Mesh).material) {
        //         //     ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         // }
        //     }
        // })
        object.scale.set(.009, .009, .009)
        object.position.y += 0.5
        object.position.x -= 1.5
        object.position.z -= 0.5
                
        scene.add(object)
    });

    // loding gltf 3d model CAR
    const loader = new GLTFLoader();
    loader.load('./free_car_001.gltf', (gltf) => {
        car = gltf.scene.children[0];
        // const backleft = car.children[6];
        // const backright = car.children[7];
        // const frontleft = car.children[8];
        // const frontright = car.children[9];
        
        car.scale.set(0.4, 0.4, 0.4)
        car.position.set(0, 0, -11.5)
        // house.enableShadows(true)
        //house.rotation.x = Math.PI / -3
        scene.add(gltf.scene);
    });

       // loding gltf 3d model PABLO
       const loader2 = new GLTFLoader();
       loader2.load('./PABLO.glb', (gltf2) => {
            name = gltf2.scene
            name.scale.set(4,4,4)
            name.position.set(2,1,-8)
           scene.add(gltf2.scene);
       });

       loader2.load('./EDUCATION.glb', (gltf2) => {
        name = gltf2.scene
        name.scale.set(4,4,4)
        name.position.set(4,1,-3)
        name.rotation.y -= 20;
       scene.add(gltf2.scene);
    });
       loader2.load('./courses.glb', (gltf2) => {
        name = gltf2.scene
        name.scale.set(4.5,4,4.5)
        name.position.set(2.5,0.5,4)
        name.rotation.y -= Math.cos(Math.PI/2 -0.2 );
       scene.add(gltf2.scene);
   });
loader2.load('./EXPERIENCE.glb', (gltf2) => {
    name = gltf2.scene
    name.scale.set(9,9,9)
    name.position.set(0,2.2,9)
    name.rotation.y -= Math.cos(Math.PI/2 );
   scene.add(gltf2.scene);
});


const ship_material = new THREE.MeshBasicMaterial( { color: 0x000000 } )     
const loader5 = new OBJLoader();
loader5.load('./city.obj',//(object) => {
      
        function( obj ){
            obj.traverse( function( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = ship_material;
                }
            } );
            obj.scale.set(0.1,0.1,0.1)
            obj.position.set(-15,-0.1,1)
            obj.rotation.y += 21.9
            scene.add( obj );
	});

    loader5.load('./city.obj',//(object) => {
      
        function( obj ){
            obj.traverse( function( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = ship_material;
                }
            } );
            obj.scale.set(0.7,0.7,0.7)
            obj.position.set(20,-0.1,-120)
            obj.rotation.y += 1
            scene.add( obj );
	});


    window.addEventListener( 'keydown', onKeyDown );
    window.addEventListener( 'keyup', onKeyUp );

window.addEventListener(
    'resize',
    () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    },
    false
)

const stats = Stats()
document.body.appendChild(stats.dom)

// const gui = new GUI()
// const cubeFolder = gui.addFolder('Cube')
// cubeFolder.add(name.rotation.y, 'z', -180, 180)
// cubeFolder.add(cube.scale, 'y', -5, 5)
// cubeFolder.add(cube.scale, 'z', -5, 5)
// cubeFolder.open()
// const cameraFolder = gui.addFolder('Camera')
// cameraFolder.add(camera.position, 'x', 0, 1000)
// cameraFolder.add(camera.position, 'y', 0, 1000)
// cameraFolder.add(camera.position, 'z', 0, 1000)
// cameraFolder.open()

function onKeyDown( event ) {
    switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW': keyControls.moveForward = true;if(car.position.z < 15){car.position.z = car.position.z+ 0.1;  camPosZ=camPosZ+0.1;modal.style.display = "none";}else{modal.style.display = "block";}break;
        case 'ArrowDown':
        case 'KeyS': keyControls.moveBackward = true;if(car.position.z > -11.5){car.position.z = car.position.z- 0.1; camPosZ=camPosZ -0.1;modal.style.display = "none";}else{modal.style.display = "block";}break;
    }
}

function onKeyUp( event ) {

    switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW': keyControls.moveForward = false; break;
        case 'ArrowDown':
        case 'KeyS': keyControls.moveBackward = false; break
    }

}

function animate() {
    requestAnimationFrame(animate)

    if(test) {
        controls.update()
    }
    else{
    camera.position.set(camPosX,camPosY,camPosZ);
    }
    render()
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()