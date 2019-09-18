var sheepGeometry = [];
for (var deg = 0; deg <= 180; deg += 6) {
    var rad = Math.PI * deg / 180;
    var point = new THREE.Vector2((0.92 + .08 * Math.cos(rad)) * Math.sin(rad), - Math.cos(rad)); // the "egg equation"
    sheepGeometry.push(point);
}

class Sheep {

    constructor(position) {

        this.position = position;
        this.rotation = new THREE.Vector3(0, 0, 0);

        this.group = new THREE.Group();
        this.group.name = "SheepGroup";

        // this.blockGeometry = new THREE.LatheBufferGeometry(sheepGeometry, 50);        
        this.blockGeometry = new THREE.OctahedronBufferGeometry(1.1, 1);
        this.blockMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            roughness: 1,
            shading: THREE.FlatShading,
            wireframe: false,
            depthTest: true,
        });

        this.hitBoxGeometry = new THREE.SphereGeometry(1.5, 10, 10);
        this.hitBoxMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFD700,
            wireframe: true,
            depthTest: true,
            transparent: false,
            opacity: 0.1,
            visible: false
        });

        this.woolMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            shading: THREE.FlatShading
        });
        this.skinMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaf8b,
            roughness: 1,
            shading: THREE.FlatShading
        });
        this.darkMaterial = new THREE.MeshStandardMaterial({
            color: 0x4b4553,
            roughness: 1,
            shading: THREE.FlatShading
        });
        this.whiteMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            wireframe: false,
            depthTest: true,
        });
        this.blackMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,
            wireframe: false,
            depthTest: true,
        });
        this.orangeMaterial = new THREE.MeshPhongMaterial({
            color: 0xFF8C00,
            wireframe: false,
            depthTest: true,
        });

        this.rayCaster = new THREE.Raycaster();

        // initially sheep is oriented vs positive Z axis
        this.sheepDirection = new THREE.Vector3(0, 0, -1);
    }

    build() {

        var hitBoxMesh = new THREE.Mesh(this.hitBoxGeometry, this.hitBoxMaterial);
        hitBoxMesh.castShadow = true;
        hitBoxMesh.receiveShadow = true;
        hitBoxMesh.name = "Sheep:HitBox";
        this.group.add(hitBoxMesh);

        var blockMesh = new THREE.Mesh(this.blockGeometry, this.blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        blockMesh.rotation.set(1.57, 0, 0);
        blockMesh.position.set(0, 0, 0);
        blockMesh.name = "Sheep:Block_0";

        this.group.add(blockMesh);

        // HEAD (children[0].childer[1 e 2])
        const head = new THREE.Group();
        head.position.set(0, 0.65, 1.2);
        head.rotation.set(-0.4, 0, 0);
        this.group.add(head);

        const foreheadGeometry = new THREE.BoxGeometry(0.7, 0.6, 0.7);
        const forehead = new THREE.Mesh(foreheadGeometry, this.skinMaterial);
        forehead.castShadow = true;
        forehead.receiveShadow = true;
        forehead.position.y = -0.15;
        head.add(forehead);

        const faceGeometry = new THREE.CylinderGeometry(0.5, 0.15, 0.4, 4, 1);
        const face = new THREE.Mesh(faceGeometry, this.skinMaterial);
        face.castShadow = true;
        face.receiveShadow = true;
        face.position.y = -0.65;
        face.rotation.y = 0.78;
        head.add(face);

        const woolGeometry = new THREE.OctahedronBufferGeometry(0.2, 1);
        const wool = new THREE.Mesh(woolGeometry, this.blockMaterial);
        wool.position.set(0, 0.3, 0.07);
        wool.rotation.x = 0.35;
        head.add(wool);

        const woolGeometry01 = wool.clone();
        woolGeometry01.position.set(0.3, 0.35, 0.2);
        head.add(woolGeometry01);

        const woolGeometry02 = wool.clone();
        woolGeometry02.position.set(-0.3, 0.35, 0);
        head.add(woolGeometry02);

        const woolGeometry03 = wool.clone();
        woolGeometry03.position.set(0.3, 0.35, 0);
        head.add(woolGeometry03);

        const woolGeometry04 = wool.clone();
        woolGeometry04.position.set(-0.3, 0.35, 0.2);
        head.add(woolGeometry04);

        const woolGeometry05 = wool.clone();
        woolGeometry05.position.set(0, 0.35, 0);
        head.add(woolGeometry05);

        const woolGeometry06 = wool.clone();
        woolGeometry06.position.set(-0, 0.35, 0.2);
        head.add(woolGeometry06);

        const rightEyeGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.06, 6);
        const rightEye = new THREE.Mesh(rightEyeGeometry, this.darkMaterial);
        rightEye.castShadow = true;
        rightEye.receiveShadow = true;
        rightEye.position.set(0.35, -0.48, 0.33);
        rightEye.rotation.set(2.285, 0, -0.785);
        head.add(rightEye);

        const leftEye = rightEye.clone();
        leftEye.position.x = -rightEye.position.x;
        leftEye.rotation.z = -rightEye.rotation.z;
        head.add(leftEye);

        const rightEarGeometry = new THREE.BoxGeometry(0.12, 0.5, 0.3);
        rightEarGeometry.translate(0, -0.25, 0);
        this.rightEar = new THREE.Mesh(rightEarGeometry, this.skinMaterial);
        this.rightEar.castShadow = true;
        this.rightEar.receiveShadow = true;
        this.rightEar.position.set(0.35, -0.12, -0.07);
        this.rightEar.rotation.set(0.35, 0, 0.872);
        head.add(this.rightEar);

        this.leftEar = this.rightEar.clone();
        this.leftEar.position.x = -this.rightEar.position.x;
        this.leftEar.rotation.z = -this.rightEar.rotation.z;
        head.add(this.leftEar);

        const legGeometry = new THREE.CylinderGeometry(0.3, 0.15, 1, 4);
        legGeometry.translate(0, -0.5, 0);
        this.frontRightLeg = new THREE.Mesh(legGeometry, this.darkMaterial);
        this.frontRightLeg.castShadow = true;
        this.frontRightLeg.receiveShadow = true;
        this.frontRightLeg.position.set(0.7, -0.8, 0.5);
        this.frontRightLeg.rotation.x = -0.21;
        this.group.add(this.frontRightLeg);

        this.frontLeftLeg = this.frontRightLeg.clone();
        this.frontLeftLeg.position.x = -this.frontRightLeg.position.x;
        this.frontLeftLeg.rotation.z = -this.frontRightLeg.rotation.z;
        this.group.add(this.frontLeftLeg);

        this.backRightLeg = this.frontRightLeg.clone();
        this.backRightLeg.position.z = -this.frontRightLeg.position.z;
        this.backRightLeg.rotation.x = -this.frontRightLeg.rotation.x;
        this.group.add(this.backRightLeg);

        this.backLeftLeg = this.frontLeftLeg.clone();
        this.backLeftLeg.position.z = -this.frontLeftLeg.position.z;
        this.backLeftLeg.rotation.x = -this.frontLeftLeg.rotation.x;
        this.group.add(this.backLeftLeg);

        this.group.position.x = this.position.x;
        this.group.position.y = this.position.y;
        this.group.position.z = this.position.z;

        game.scene.add(this.group);

        this.blocks = 1; // adding first sheep

    }


    movesheep(x, y, z) {
        /*
            Impartisce i comandi alla testa
            Aggiunto per pulizia e per usi futuri (if WallHit then goRight)  
        */

        this.sheepGroup.children[0].position.x += x;
        this.sheepGroup.children[0].position.y += y;
        this.sheepGroup.children[0].position.z += z;

        /*         this.sheepGroup.children[0].children[1].position.x = 3;
                this.sheepGroup.children[0].children[2].position.x = 3; */


    }

    setOrientation(x, y, z) {

        this.sheepDirection = new THREE.Vector3(x, y, z);

        /*
            Questa sezione qui sotto serve a capire come girare la testa
            in base alla direzione del movimento
        */

        if (x != 0) {

            if (this.sheepGroup.children[0].rotation.x > 0) {
                this.sheepGroup.children[0].rotation.x += - 0.1;
            }
            else if (this.sheepGroup.children[0].rotation.x < 0) {
                this.sheepGroup.children[0].rotation.x += 0.1;
            }

            if (this.sheepGroup.children[0].rotation.z > 0) {
                this.sheepGroup.children[0].rotation.z += - 0.1;
            }
            else if (this.sheepGroup.children[0].rotation.z < 0) {
                this.sheepGroup.children[0].rotation.z += 0.1;
            }


            //1 Premo A e sto in posizione 0: arrivo in posizione y = 1.5
            if ((x > 0) && (this.sheepGroup.children[0].rotation.y >= 0) && (this.sheepGroup.children[0].rotation.y < 1.45)) {
                this.sheepGroup.children[0].rotation.y += 0.1;
                if (this.sheepGroup.children[0].rotation.y > 1.4) {
                    this.sheepGroup.children[0].rotation.y = 1.5;
                };
            }

            //5 Premo D e sto in posizione 0: arrivo in posizione y = 1.5
            else if ((x < 0) && (this.sheepGroup.children[0].rotation.y < 1)) {
                this.sheepGroup.children[0].rotation.y = 6;
            }
            else if ((x < 0) && (this.sheepGroup.children[0].rotation.y > 4.65) && (this.sheepGroup.children[0].rotation.y < 6.05)) {
                this.sheepGroup.children[0].rotation.y += -0.1;
                if (this.sheepGroup.children[0].rotation.y < 4.65) {
                    this.sheepGroup.children[0].rotation.y = 4.6;
                };
            }
            //7 Premo A e sto in posizione 3.4 o -3.4: arrivo in posizione y = 1.7
            else if ((x > 0) && (this.sheepGroup.children[0].rotation.y > 1.55) && (this.sheepGroup.children[0].rotation.y < 3.2)) {
                this.sheepGroup.children[0].rotation.y += -0.1;
                if (this.sheepGroup.children[0].rotation.y < 1.6) {
                    this.sheepGroup.children[0].rotation.y = 1.5;
                };
            }

            //3 Premo D e sto in posizione 3.1 o -3.1: arrivo in posizione y = 1.5
            else if ((x < 0) && ((this.sheepGroup.children[0].rotation.y >= 3.1) && (this.sheepGroup.children[0].rotation.y < 4.55))) {
                this.sheepGroup.children[0].rotation.y += 0.1;
                if (this.sheepGroup.children[0].rotation.y > 4.5) {
                    this.sheepGroup.children[0].rotation.y = 4.6;
                };
            }
        }

        if (y != 0) {
            this.sheepGroup.children[0].rotation.z = 0;
            this.sheepGroup.children[0].rotation.x = -y * Math.PI / 2;
            this.sheepGroup.children[0].rotation.y = 0;
        }

        if (z != 0) {

            if (this.sheepGroup.children[0].rotation.x > 0) {
                this.sheepGroup.children[0].rotation.x += -0.1;
            }
            else if (this.sheepGroup.children[0].rotation.x < 0) {
                this.sheepGroup.children[0].rotation.x += 0.1;
            }

            if (this.sheepGroup.children[0].rotation.z > 0) {
                this.sheepGroup.children[0].rotation.z += -0.1;
            }
            else if (this.sheepGroup.children[0].rotation.z < 0) {
                this.sheepGroup.children[0].rotation.z += 0.1;
            }
            //4 Premo W e sto in posizione 1.5: arrivo in posizione y = 0
            if ((z > 0) && (this.sheepGroup.children[0].rotation.y >= 4.55) && (this.sheepGroup.children[0].rotation.y < 6.05)) {
                this.sheepGroup.children[0].rotation.y += 0.1;
                if (this.sheepGroup.children[0].rotation.y > 6) {
                    this.sheepGroup.children[0].rotation.y = 0;
                };
            }
            //6 Premo S e sto in posizione -1.5: arrivo in posizione y = -3.4
            else if ((z < 0) && (this.sheepGroup.children[0].rotation.y <= 4.65) && (this.sheepGroup.children[0].rotation.y >= 3.15)) {
                this.sheepGroup.children[0].rotation.y += -0.1;
                if (this.sheepGroup.children[0].rotation.y < 3.2) {
                    this.sheepGroup.children[0].rotation.y = 3.1;
                };
            }
            //8 Premo W e sto in posizione -1.5: arrivo in posizione y = 0
            else if ((z > 0) && (this.sheepGroup.children[0].rotation.y > 0.05) && (this.sheepGroup.children[0].rotation.y < 1.75)) {
                this.sheepGroup.children[0].rotation.y += -0.1;
                if (this.sheepGroup.children[0].rotation.y < 0.1) {
                    this.sheepGroup.children[0].rotation.y = 0;
                };
            }
            //2 Premo S e sto in posizione 1.5: arrivo in posizione y = 3.1
            else if ((z < 0) && (this.sheepGroup.children[0].rotation.y >= 1.45) && (this.sheepGroup.children[0].rotation.y < 3.05)) {
                this.sheepGroup.children[0].rotation.y += 0.1;
                if (this.sheepGroup.children[0].rotation.y > 3) {
                    this.sheepGroup.children[0].rotation.y = 3.1;
                };
            }
        }
    }

    addSheep() {

        game.scene.remove(sheep.group);
        sheep = new Sheep(new THREE.Vector3(Math.random(-10) * 10, 2, Math.random(-10) * 10));
        sheep.build();

        // globalKeyPressed = null;

    }

    update() {

        // to-do

    }
}
