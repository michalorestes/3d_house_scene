 var scene, camera, renderer, controls; 
 var greenMat, greyMat, brownMat, whiteMat, basketballLeft, basketballRight, roofMat, glassMat, concreteMat, doorMat, woodMat, basketBoardMat;
 var ambLight, houseLight1, basketballLights;
var basketball, player;
var throwing;
var score;
 // once everything is loaded, we run our Three.js stuff.
$(function() {
    initialiseSetup();
    score = 1;
    //indicates if player is currently throwing the ball
    throwing = false;
    //holds lights indicating that player has scored a goal
    basketballLights = [];
    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(1500, 1500);
    var plane = new THREE.Mesh(planeGeometry, greenMat);
    plane.receiveShadow = true;
    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    //apply material with texture to the plane
    plane.material.map.repeat.set(2,2);
    plane.material.map.wrapS = THREE.RepeatWrapping;
    plane.material.map.wrapT = THREE.RepeatWrapping;
    // add the plane to the scene
    scene.add(plane);

    var stats = initStats();
    mansion();
    getBasketballCourt();

    //set up GUI
    $("#WebGL-output").append(renderer.domElement);

    var controls = new function () {
        this.night = false;
        this.houseLight = true;
        this.goal = false;

    };

    var gui = new dat.GUI();
    gui.add(controls, 'night');
    gui.add(controls, 'houseLight');
    gui.add(controls, 'goal');

    // add the output of the renderer to the html element
    $("#WebGL-output").append(renderer.domElement);

    // call the render function
    render();

    function render() {
        //if player is not currently throwing the ball, make it fall on the ground
        if (player.position.y > 20 && !throwing){
            player.position.y -= 5;
        }

        //check if player scored a goal
        if (player.position.x > 780 && player.position.y == 130 && player.position.z > -10 && player.position.z < 10){
            document.getElementById("score").innerHTML = score++;
            //if true, turn on the lights
            for (i = 0; i < basketballLights.length; i ++){
                basketballLights[i].intensity = 1.5;
            }
            //turn off the lights after 5 seconds
            setTimeout(function() {
                for (i = 0; i < basketballLights.length; i ++){
                    basketballLights[i].intensity = 0;
                }
            }, 5000);
        }

        //switch between day and night modes
        if (controls.night == true){
            ambLight.color.setRGB(0,0,0);
        } else {
            ambLight.color.setHex("0xffffff");
        }
        //turn on/off house lights
        if (controls.houseLight == true){
            houseLight1.intensity = 1.0;
        } else{
            houseLight1.intensity = 0.0;
        }

        //goal animation
        if (controls.goal == true){
            if (basketball.position.x != -240 ) {
                basketball.position.y += 5;
                basketball.position.x -= 10;
            } else {
                if (basketball.position.y > 10){
                    basketball.position.y -= 3;
                } else {
                    basketball.position.x = 200;
                    controls.goal = false;
                }
            }
        }
        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
});

function animate() {
    requestAnimationFrame( animate );
    controls.update();
 }

//event for detecting which key has been pressed
 //used for controlling the player
 function onDocumentKeyDown(event) {
    var keyCode = event.which;
     var speed = 1.5;
     switch (keyCode){
         case 87:
             //W button
             player.position.z -= 5 * speed;
             player.rotation.z -= 1 * speed;
             break;
         case 83:
             //S button
             player.position.z += 5 * speed;
             player.rotation.z += 1 * speed;
             break;
         case 65:
             //A button
             player.position.x -= 5 * speed;
             player.rotation.x -= 1 * speed;
             break;
         case 68:
             //D button
             player.position.x += 5 * speed;
             player.rotation.x += 1 * speed;
             break;
         case 81:
             //Q button
             throwing = true;
             player.position.y += 10 * speed;
             break;
     }
 };
//checks when jump button has been released to update "throwing" variable
 function onDocumentKeyUp(event) {
     var keyCode = event.which;
     var speed = 1.5;
     switch (keyCode){
         case 81:
             //q button
             throwing = false;
             break;
     }
 };

function initialiseSetup(){
   //onkeydown event for keyboard input
    document.addEventListener("keydown", onDocumentKeyDown, false);
    document.addEventListener("keyup", onDocumentKeyUp, false);
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 500;
   // camera.lookAt(scene.position);

    // create a render and set the size
    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(0xEEEEEE, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
   // renderer.shadowMap.enabled = true;

    controls = new THREE.OrbitControls( camera );
    //controls.addEventListener( 'change', renderer );
    animate();
    
    //initialise lights
    initialiseLights();
    initialiseMaterials();
}

//show statistics
 function initStats() {

     var stats = new Stats();

     stats.setMode(0); // 0: fps, 1: ms

     // Align top-left
     stats.domElement.style.position = 'absolute';
     stats.domElement.style.left = '0px';
     stats.domElement.style.top = '0px';

     $("#Stats-output").append(stats.domElement);

     return stats;
 }

function initialiseLights(){
    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(100,1000,100);
    dirLight.intensity = 0.1;
    dirLight.castShadow = true;
    scene.add(dirLight);

    houseLight1 = new THREE.PointLight(0x0061ff,1.0);
    houseLight1.position.y = 350;
    houseLight1.position.z = -140;
    scene.add(houseLight1);

    ambLight = new THREE.AmbientLight(0xffffff);
    ambLight.position.set(-100,1000,0);
    ambLight.intensity = 0.01;
    scene.add(ambLight);
}

function initialiseMaterials(){
    //textures
    var brickTexture = new THREE.TextureLoader().load("images/brick.png");
    var grassTexture = new THREE.TextureLoader().load("images/grass.jpg");
    var basketballLeftTexture = new THREE.TextureLoader().load("images/basketballLeft.jpg");
    var basketballRightTexture = new THREE.TextureLoader().load("images/basketballRight.jpg");
    var roofTexture = new THREE.TextureLoader().load("images/roof.jpg");
    var glassTexture = new THREE.TextureLoader().load("images/glass.jpg");
    var concreteTexture = new THREE.TextureLoader().load("images/concrete.jpg");
    var doorTexture = new THREE.TextureLoader().load("images/door.jpg");
    var woodTexture = new THREE.TextureLoader().load("images/wood.jpg");
    var basketBoardTexture = new THREE.TextureLoader().load("images/basketBoard.jpg");
    var basketballTexture = new THREE.TextureLoader().load("images/basketball.jpg");
    //materials
    basketballMat = new THREE.MeshPhongMaterial();
    basketballMat.map = basketballTexture;
    greenMat = new THREE.MeshPhongMaterial();
    greenMat.map = grassTexture;
     brownMat = new THREE.MeshPhongMaterial();
     brownMat.map = brickTexture;
     brownMat.normalMap =
     whiteMat = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
     greyMat = new THREE.MeshBasicMaterial({color: 0x7a7a7a, side: THREE.DoubleSide});
     basketballLeft = new THREE.MeshPhongMaterial();
    basketballLeft.map = basketballLeftTexture;
    basketballRight = new THREE.MeshPhongMaterial();
    basketballRight.map = basketballRightTexture;
    roofMat = new THREE.MeshPhongMaterial();
    roofMat.map = roofTexture;
    glassMat = new THREE.MeshPhongMaterial();
    glassMat.map = glassTexture;
    concreteMat = new THREE.MeshPhongMaterial();
    concreteMat.map = concreteTexture;
    doorMat = new THREE.MeshPhongMaterial();
    doorMat.map = doorTexture;
    woodMat = new THREE.MeshPhongMaterial();
    woodMat.map = woodTexture;
    basketBoardMat = new THREE.MeshPhongMaterial();
    basketBoardMat.map = basketBoardTexture;
}

function getBasketballCourt(){
    var courtGroup = new THREE.Object3D();
    courtGroup.position.z = 350;
    courtGroup.position.x = -250;
    scene.add(courtGroup);
   //court base
    var leftSideGeo =  new THREE.BoxGeometry(550, 10, 400, 10, 1, 10);
    var leftSideMesh = new THREE.Mesh(leftSideGeo, basketballLeft);
    var rightSideMesh = new THREE.Mesh(leftSideGeo, basketballRight);
    rightSideMesh.position.x = 550;
    //baskets
    var leftBasket = getBasket();
    leftBasket.position.x = -250;
    var rightBasket = getBasket();
    rightBasket.position.x = 800;
    rightBasket.rotation.y = 1.0 * Math.PI;
    // "AI" basketball
    basketball = new THREE.Object3D();

    var basketballGeo = new THREE.SphereGeometry(10,10,30);
    var basketballMesh = new THREE.Mesh(basketballGeo, basketballMat);
    var basketballLight = new THREE.PointLight(0xFF0000, 3.0, 300);
    basketball.add(basketballMesh);
    basketball.add(basketballLight);
    basketball.position.x= 0;
    basketball.position.y= 25;
    basketball.position.z= 0;


    //create the player on the basketball court
    player = new THREE.Object3D();
    player.add(new THREE.Mesh(basketballGeo, basketballMat));
    player.add(new THREE.PointLight(0x00ff48, 1.0, 300));
    player.position.y = 20;
    player.position.x = 225;

    //score lights setup and position
    var startPos = -200;
    for(i = 0; i<5; i++){
        basketballLights.push(createPointLight(0xffe500));
        basketballLights[i].position.z = startPos;
        basketballLights[i].position.y = 20;
        basketballLights[i].position.x = 800;
        courtGroup.add(basketballLights[i]);
        startPos += 100;
    }

    courtGroup.add(player);
    courtGroup.add(basketball);
    courtGroup.add(leftBasket);
    courtGroup.add(rightBasket);
    courtGroup.add(leftSideMesh);
    courtGroup.add(rightSideMesh);
}
//used for creating point lights
function  createPointLight(color) {
    return new THREE.PointLight(color, 0.0, 500);
}

//create a single basket
function getBasket() {
    var basket = new THREE.Object3D();

    var cylinder = new THREE.CylinderGeometry(5,5,150,10);
    var cylinderMesh = new THREE.Mesh(cylinder, greyMat);
    cylinderMesh.position.y = 75;

    var circle = new THREE.TorusGeometry( 15, 3, 16, 100 );
    var circleMesh = new THREE.Mesh(circle, greyMat);
    circleMesh.position.y = 130;
    circleMesh.position.x = 10;
    circleMesh.position.z = 0;
    circleMesh.rotation.x = 0.5 * Math.PI;

    var top = new THREE.BoxGeometry(80,50, 2, 2, 2);
    var topMesh = new THREE.Mesh(top, basketBoardMat);
    topMesh.position.y = 150;
    topMesh.position.x = 0;
    topMesh.rotation.y = 0.5 * Math.PI;


    basket.add(topMesh);
    basket.add(circleMesh);
    basket.add(cylinderMesh);
    return basket;
}

function mansion(){
    
    var mansionGroup = new THREE.Object3D();
    mansionGroup.position.x = 0;
    mansionGroup.position.z = -400;
    scene.add(mansionGroup);
    //set up middle of the mansion
    var middleGeo = new THREE.BoxGeometry( 300, 300, 300 );
    var middle = new THREE.Mesh( middleGeo, brownMat );
    middle.rotation.y = Math.PI / 2;
    middle.position.x = 0;
    middle.position.y = 150;
    middle.position.z = 0;
    middle.material.map.repeat.set(0.2,1);
    middle.material.map.wrapS = THREE.RepeatWrapping;
    middle.material.map.wrapT = THREE.RepeatWrapping;

    //set up back of the mansion
    var backWingGeo = new THREE.BoxGeometry( 1000, 300, 200 );
    var backWing = new THREE.Mesh( backWingGeo  , brownMat );
    backWing.position.y = 150; 
    backWing.position.x = 0;
    backWing.position.z = -200;
    backWing.material.map.repeat.set(5,3);
    backWing.material.map.wrapS = THREE.RepeatWrapping;
    backWing.material.map.wrapT = THREE.RepeatWrapping;

    //create rooftop
    var roofGroup = new THREE.Object3D();
    var roofShape = createExtrudedGeometry(1000, 100);
    var roofMesh = new THREE.Mesh(roofShape, roofMat);
    roofMesh.material.map.repeat.set(1,1);
    roofMesh.material.map.wrapS = THREE.RepeatWrapping;
    roofMesh.material.map.wrapT = THREE.RepeatWrapping;
    roofGroup.add(roofMesh);
    roofGroup.position.y = 300;

    //second part of the rooftop
    var roofShapeFront = createExtrudedGeometry2(450, 100);
    var roofMeshFront = new THREE.Mesh(roofShapeFront, roofMat);
    roofMeshFront.material.map.repeat.set(1,1);
    roofMeshFront.material.map.wrapS = THREE.RepeatWrapping;
    roofMeshFront.material.map.wrapT = THREE.RepeatWrapping;
    roofGroup.add(roofMeshFront);
    roofMeshFront.position.y = 0;
    roofMeshFront.position.x = -200;
    roofMeshFront.position.z = 25;
    roofMeshFront.rotation.y = -0.5 * Math.PI;
    
    var frontRoundWindowGeo = new THREE.CylinderGeometry( 30, 30, 5, 32 );
    var frontRoundWindowMesh = new THREE.Mesh( frontRoundWindowGeo, glassMat );
    frontRoundWindowMesh.material.map.repeat.set(1,1);
    frontRoundWindowMesh.material.map.wrapS = THREE.RepeatWrapping;
    frontRoundWindowMesh.material.map.wrapT = THREE.RepeatWrapping;
    frontRoundWindowMesh.position.z = 250; 
    frontRoundWindowMesh.position.y = 50; 
    frontRoundWindowMesh.rotation.x = -0.5 * Math.PI;
    roofGroup.add(frontRoundWindowMesh);

    //create pillars
    var pilarLeftGeo = new THREE.CylinderGeometry( 20, 20, 300, 32 );
    var pilarLeft = new THREE.Mesh( pilarLeftGeo, concreteMat );
    pilarLeft.material.map.repeat.set(1,1);
    pilarLeft.material.map.wrapS = THREE.RepeatWrapping;
    pilarLeft.material.map.wrapT = THREE.RepeatWrapping;
    pilarLeft.position.z = 220;
    pilarLeft.position.x = -150;
    pilarLeft.position.y = -150;
    roofGroup.add( pilarLeft );
    
    var pilarRight = new THREE.Mesh( pilarLeftGeo, concreteMat );
    pilarRight.material.map.repeat.set(1,2);
    pilarRight.material.map.wrapS = THREE.RepeatWrapping;
    pilarRight.material.map.wrapT = THREE.RepeatWrapping;
    pilarRight.position.z = 220;
    pilarRight.position.x = 150;
    pilarRight.position.y = -150;
    roofGroup.add( pilarRight );

    //stairs
    var stairsGroup = new THREE.Object3D();
    stairsGroup.position.z = 140; 
    stairsGroup.position.y = 0;
    
    //Generate stairs 
    var zPos = 0; 
    var yPos = 0; 
    for(var i = 5; i > 1; i-- ){
        yPos = 10 * i; 
        var stepGeo = new THREE.BoxGeometry( 200, yPos, 20 );
        var step = new THREE.Mesh( stepGeo, concreteMat );
        step.material.map.repeat.set(2,2);
        step.material.map.wrapS = THREE.RepeatWrapping;
        step.material.map.wrapT = THREE.RepeatWrapping;
        zPos += 20;
        step.position.z = zPos;
        step.position.y = yPos / 2;
        stairsGroup.add(step);
    }
    
    var doorGroup = new THREE.Object3D;
    var doorGeo = new THREE.BoxGeometry(100, 180, 10);
    var doorMesh  = new THREE.Mesh(doorGeo, doorMat);
    doorGroup.add(doorMesh)
    doorGroup.position.z = 150; 
    doorGroup.position.y = 140;
    
    var balcony1 = getBalcony();  
    balcony1.position.z = 0;
    balcony1.position.y = 150;
    balcony1.position.x = 300;

    var window = getWindow(2);
    window.position.z = -100;
    window.position.y = 200;
    window.position.x = -400;

    var backWindows = getWindow(8);
    backWindows.position.z = -300;
    backWindows.position.y = 200;
    backWindows.position.x = 415;

    backWindows.rotation.y = -1.0 * Math.PI;

    mansionGroup.add(backWindows);
    mansionGroup.add(window);
    mansionGroup.add(balcony1);
    mansionGroup.add(doorGroup)  ;
    mansionGroup.add(stairsGroup);
    mansionGroup.add(roofGroup);
    mansionGroup.add( middle );
    mansionGroup.add( backWing );
}
function getWindow(numberOfWindows){
    var windowGroup = new THREE.Object3D();
    var window = new THREE.BoxGeometry(80, 100, 10);
    var windowBase = new THREE.BoxGeometry(80, 10, 20);

    for(var i = 0; i < numberOfWindows; i++){
        var windowMesh = new THREE.Mesh(window, glassMat);
        windowMesh.material.map.repeat.set(1,1);
        windowMesh.material.map.wrapS = THREE.RepeatWrapping;
        windowMesh.material.map.wrapT = THREE.RepeatWrapping;
        var windowBaseMesh = new THREE.Mesh(windowBase, woodMat);

        windowMesh.position.x =120 * i;
        windowMesh.position.y =0;
        windowMesh.position.z =0;
        windowBaseMesh.position.x = 120 * i;
        windowBaseMesh.position.y =-50;
        windowBaseMesh.position.z =5;
        windowGroup.add(windowBaseMesh);
        windowGroup.add(windowMesh);
    }

    return windowGroup;
}

function getBalcony(){
    var balconyGroup = new THREE.Object3D(); 
    var baseGeo = new THREE.BoxGeometry(300, 5, 150);
    var baseMesh = new THREE.Mesh(baseGeo, woodMat);
    baseMesh.position.z = -40;
    
    var windowGeo = new THREE.BoxGeometry(300,100, 5);
    var windowMesh = new THREE.Mesh(windowGeo, glassMat);
    windowMesh.material.map.repeat.set(1,1);
    windowMesh.material.map.wrapS = THREE.RepeatWrapping;
    windowMesh.material.map.wrapT = THREE.RepeatWrapping;
    windowMesh.position.y = 50;
    windowMesh.position.z = -100;
    
    var frontBarrierGeo = new THREE.BoxGeometry(300,40, 5);
    var frontBarrierMesh = new THREE.Mesh(frontBarrierGeo, brownMat);
    frontBarrierMesh.position.y = 20;
    frontBarrierMesh.position.z = 30;
    
    var sideBarrierGeo = new THREE.BoxGeometry(5,40, 140);
    var sideBarrierMesh = new THREE.Mesh(sideBarrierGeo, brownMat);
    sideBarrierMesh.position.y = 20;
    sideBarrierMesh.position.z = -35;
    sideBarrierMesh.position.x = 150;
    
    var pilarLeftGeo = new THREE.CylinderGeometry( 15, 15, 150, 32 );
    var pilarRight = new THREE.Mesh( pilarLeftGeo, concreteMat );
    pilarRight.position.z = 0;
    pilarRight.position.x = 120;
    pilarRight.position.y = -75;
    balconyGroup.add( pilarRight );

    balconyGroup.add(sideBarrierMesh);
    balconyGroup.add(frontBarrierMesh);
    balconyGroup.add(baseMesh);
    balconyGroup.add(windowMesh);

    return balconyGroup;
}

//below methods are used for greating extruded rooftop
 function createExtrudedGeometry(length, segments) {
     // this is the cross section
     var points = [];
     points.push(new THREE.Vector2(50, 1));
     points.push(new THREE.Vector2(350, 0));
     points.push(new THREE.Vector2(200, 150));
     var shape = new THREE.Shape(points);

     var extrudeSettings = {steps: segments};
     extrudeSettings.extrudePath = new THREE.LineCurve3(
         new THREE.Vector3(-length / 2, 0, 0),
         new THREE.Vector3(length / 2, 0, 0));

     var prismGeometry = shape.extrude(extrudeSettings);
     return prismGeometry;
 }

 function createExtrudedGeometry2(length, segments) {
     // this is the cross section
     var points = [];
     points.push(new THREE.Vector2(0, 1));
     points.push(new THREE.Vector2(400, 0));
     points.push(new THREE.Vector2(200, 100));
     var shape = new THREE.Shape(points);

     var extrudeSettings = {steps: segments};
     extrudeSettings.extrudePath = new THREE.LineCurve3(
         new THREE.Vector3(-length / 2, 0, 0),
         new THREE.Vector3(length / 2, 0, 0));
     
     var prismGeometry = shape.extrude(extrudeSettings);
     return prismGeometry;
 }

 //http://gatortank.blogspot.co.uk/
 //https://uk.pinterest.com/barz0227/modelagem-e-texturas/
//http://www.zrarts.com/Basketball-Court/
 //http://img10.deviantart.net/6223/i/2010/226/9/d/glass_texture_blue_by_rhuday.jpg
 //http://pre08.deviantart.net/9d8c/th/pre/i/2011/346/0/7/door_texture_by_ancientorange-d4ix003.jpg
 //http://naveensabesan.blogspot.co.uk/2012/08/cosco.html

