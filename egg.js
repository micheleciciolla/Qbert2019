// array per la geometria dell' uovo
var eggGeometry = [];
for (var deg = 0; deg <= 180; deg += 6) {
    var rad = Math.PI * deg / 180;
    var point = new THREE.Vector2((0.72 + .08 * Math.cos(rad)) * Math.sin(rad), - Math.cos(rad)); // the "egg equation"
    eggGeometry.push(point);
}

class Egg {

    constructor(position) {

        this.position = position;
        this.rotation = new THREE.Vector3(0, 0, 0);

        this.group = new THREE.Group();
        this.group.name = "EggGroup";

        this.blockGeometry = new THREE.LatheBufferGeometry(eggGeometry, 50);
        this.blockMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFAA55,
            wireframe: false,
            depthTest: true,
        });

        this.hitBoxGeometry = new THREE.SphereGeometry(1.5, 10, 10);
        this.hitBoxMaterial = new THREE.MeshPhongMaterial({
            color: 0xFF0000,
            wireframe: true,
            depthTest: true,
            transparent: false,
            opacity: 0.1,
            visible: false
        });
        this.rayCaster = new THREE.Raycaster();
    }

    build() {

        var hitBoxMesh = new THREE.Mesh(this.hitBoxGeometry, this.hitBoxMaterial);
        hitBoxMesh.castShadow = true;
        hitBoxMesh.receiveShadow = true;
        hitBoxMesh.name = "Egg:HitBox";
        this.group.add(hitBoxMesh);

        var blockMesh = new THREE.Mesh(this.blockGeometry, this.blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        blockMesh.name = "Egg:Block_0";

        this.group.add(blockMesh);

        /*
        var blockMesh = new THREE.Mesh(this.blockGeometry, this.blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        blockMesh.name = "Egg:Block_1";

        blockMesh.rotation.x = 90 / (Math.PI / 2);
        blockMesh.rotation.z = 90 / (Math.PI / 2);
        blockMesh.position.x = +1;
        blockMesh.position.y = +1;
        blockMesh.position.z = +1;
        this.group.add(blockMesh);

        var blockMesh = new THREE.Mesh(this.blockGeometry, this.blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        blockMesh.name = "Egg:Block_2";

        blockMesh.rotation.x = 180 / (Math.PI / 2);
        blockMesh.rotation.z = 180 / (Math.PI / 2);
        blockMesh.position.x = -1;
        blockMesh.position.y = +1;
        blockMesh.position.z = +1;
        this.group.add(blockMesh);

        */

        this.group.position.x = this.position.x;
        this.group.position.y = this.position.y;
        this.group.position.z = this.position.z;

        game.scene.add(this.group);

        this.blocks = 1; // adding first egg

    }

    addEgg() {

        var blockMesh = new THREE.Mesh(this.blockGeometry, this.blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        blockMesh.name = "Egg_" + this.blocks; // nomina gli Egg_2, Egg_3 ecc.. 

        // bisogna controllare che non si sovrappongano uova sulla stessa posizione
        blockMesh.position.x = Math.random(-20)*20;
        // blockMesh.position.y = Math.random(-20)*20;;
        blockMesh.position.z = Math.random(-20)*20;;

        this.group.add(blockMesh);
        this.blocks++;

        globalKeyPressed = null;

    }

    getPosition(){

        return this.egg.position;
    }

    update() {
        var t = game.timer.getElapsedTime();

        // this.group.rotation.y = t * 16 / (2 * Math.PI);
        // this.group.rotation.z = t * 10 / (2 * Math.PI);
        // this.group.rotation.x = t * 35 / (2 * Math.PI);

        this.group.position.y += Math.sin(3 * t) / 100;
    }
}
