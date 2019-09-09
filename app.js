// flaviuzzo se lo ritogli ti meno il corpo!
var textureAttive = true;

class Game {
    constructor() {


        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x00);    // Dark black background

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 200);
        this.camera.lookAt(this.scene.position);
        this.camera.position.set(0, 3, -10);
        this.camera.rotation.y -= 30 / (2 * Math.PI);

        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.body.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);

        this.mouseDown = false;

        this.timer = new THREE.Clock();
        this.timer.start();

        this.update = function dummyUpdate() { };
    }

    addLights() {
        var spotLight = new THREE.SpotLight(0xDDDDDD, 0.5);
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        //Set up shadow properties for the light
        spotLight.position.set(10, 40, -20);
        spotLight.shadow.mapSize.width = 512;  // default
        spotLight.shadow.mapSize.height = 512; // default

        // Helper
        const slh = new THREE.SpotLightHelper(spotLight);
        this.scene.add(slh);

        const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9);
        this.scene.add(light);
        const lh = new THREE.HemisphereLightHelper(light);
        this.scene.add(lh);

        /*
        const directLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directLight1.castShadow = true;
        directLight1.position.set(9.5, 8.2, 8.3);
        this.scene.add(directLight1);
        const dlh1 = new THREE.DirectionalLightHelper( directLight1 );
        this.scene.add(dlh1);
        */

        /*
        const directLight2 = new THREE.DirectionalLight(0xffffff, 2);
        directLight2.castShadow = true;
        directLight2.position.set(-15.8, 5.2, 8);
        this.scene.add(directLight2);
        const dlh2 = new THREE.DirectionalLightHelper( directLight2 );
        this.scene.add(dlh2);
        */
    }

    /* Creates river.  */
    createRiver(dimX, dimY, dimZ, posY, posZ) {

        var lRiver, lRiverGeometry, lRiverMaterial, lRiverTex;

        lRiverGeometry = new THREE.BoxGeometry(dimX, dimY, dimZ);
        lRiverTex = applyTex("textures/water.jpg", 4, 8);

        lRiverMaterial = new THREE.MeshBasicMaterial({ map: lRiverTex });
        lRiver = new THREE.Mesh(lRiverGeometry, lRiverMaterial);

        lRiver.position.y = posY;
        lRiver.position.z = posZ;

        this.scene.add(lRiver);

    }

    //Creazione di un oggetto immagine "albero" nel workspace
    createTrees()
    {

    var i, tree;
    var treeTexture = THREE.ImageUtils.loadTexture("textures/tree.png");


    var treeMaterial = new THREE.SpriteMaterial ({ map: treeTexture, 
                               useScreenCoordinates: 
                               false });
        for (i = 0; trees.posZRight - (i * 200) > -scr.w; i++)
        {
            //albero
            tree = new THREE.Sprite (treeMaterial); 
                                /* Use sprites so that
                                 * the trees will
                                 * always point to 
                                 * the camera.  */
            
                    tree.position.set (trees.posXRight , trees.posYRight,trees.posZRight - (i * 400));
                    tree.scale.set (trees.scaleX, trees.scaleY, 1.0);
                    this.scene.add (tree);

            
        }

    }

    /* Function that creates the skybox with 512*512 size pictures.  */
    createSkyBox() {

        var path, urls, textureCube, shader, skyMaterial, sky;


        path = "textures/";
        urls = [path + "posx.jpg", path + "negx.jpg", path + "posy.jpg",
        path + "negy.jpg", path + "posz.jpg", path + "negz.jpg"];

        textureCube = THREE.ImageUtils.loadTextureCube(urls);
        textureCube.format = THREE.RGBFormat;

        shader = THREE.ShaderLib.cube;
        shader.uniforms.tCube.value = textureCube;

        skyMaterial = new THREE.ShaderMaterial
            ({
                fragmentShader: shader.fragmentShader,
                vertexShader: shader.vertexShader,
                uniforms: shader.uniforms,
                depthWrite: false,
                side: THREE.BackSide
            });

        /*  Define the skybox: it's a cube 4096*4096*4096.  */
        sky = new THREE.Mesh(new THREE.BoxGeometry(4096, 4096, 4096),
            skyMaterial);
        this.scene.add(sky);

    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.stats.begin();

        this.controls.update();

        this.stats.end();

        this.update();

        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

/*
document.onmousedown = function onMouseDown()
{ 
    // Only for debug
    //console.log("[onMouseDown()] Mouse button pressed.");
    //console.log("Button pressed: " + event.button);
    //console.log("At: " + event.clientX + ", " + event.clientY);
};

document.onmouseup = function onMouseUp()
{
    // Only for debug
    //console.log("[onMouseUp()] Mouse button release");
    //console.log("Button released: " + event.button)
    //console.log("At: " + event.clientX + ", " + event.clientY);
};
*/

// THE GAME ITSELF (just like main() in c++)
var globalKeyPressed;
var game = new Game();
var globalMap = makeMap();
var snake;
var food;
var duck;
var delta = 0;

//ALBERI ///////////////////
var trees =
{
    scaleX: 64, /* Trees are 64*64.  */
    scaleY: 64,

    posXRight: 50,
    posYRight: 30, /* + 32 = 64 / 2.  */
    posZRight: 0
}
var scr = /* Screen dimensions.  */
{
    w: window.innerWidth,
    h: window.innerHeight
}
//////////////////////////

window.onload = function main() {
    game.update = updateFunction;
    game.addLights();
    
    if(textureAttive){
        game.createRiver(10, 0, 100, -0.4, 0);  //larghezza altezza lunghezza posY posZ
        game.createSkyBox();
        game.createTrees();
    }

    game.scene.add(globalMap);

    snake = new Snake();
    snake.buildHead();

    snake.addBlockEgg();
    snake.addBlockEgg();
    snake.addBlockEgg();

    egg = new Egg(new THREE.Vector3(0, 2, 10));
    egg.build();

    duck = new Duck(new THREE.Vector3(0, 2, 20));
    duck.build();

    /*

    food = new Food(new THREE.Vector3(5,2,0));
    food.build();
    food.randomFood(); 

    */
    game.animate();
}

document.onkeydown = function checkKey(e) {
    globalKeyPressed = (e || window.event).keyCode;

    // [ E ] add edd
    if (globalKeyPressed == 69) egg.addEgg();
    // [ R ] add duck
    if (globalKeyPressed == 82) duck.addDuck();

}

// Needed by Game class
var updateFunction = function () {
    // snake.swag(delta);
    delta += 0.7;

    snake.update();
    //food.update();
    egg.update();
    duck.update();

    // globalKeyPressed = null;

}   
