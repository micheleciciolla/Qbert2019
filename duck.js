// array per la geometria dell' uovo
var eggGeometry = [];
for (var deg = 0; deg <= 180; deg += 6) {
    var rad = Math.PI * deg / 180;
    var point = new THREE.Vector2((0.72 + .08 * Math.cos(rad)) * Math.sin(rad), - Math.cos(rad)); // the "egg equation"
    eggGeometry.push(point);
}


class Duck {

    constructor(position) {

        this.position = position;
        this.rotation = new THREE.Vector3(0, 0, 0);

        this.group = new THREE.Group();
        this.group.name = "DuckGroup";

        this.blockGeometry = new THREE.LatheBufferGeometry(eggGeometry, 50);
        this.blockMaterial = new THREE.MeshPhongMaterial({
            color: 	0xFFD700,
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

        this.skinMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFD700, 
            wireframe: false,
            depthTest: true,
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
    }

    build() {

        var hitBoxMesh = new THREE.Mesh(this.hitBoxGeometry, this.hitBoxMaterial);
        hitBoxMesh.castShadow = true;
        hitBoxMesh.receiveShadow = true;
        hitBoxMesh.name = "Duck:HitBox";
        this.group.add(hitBoxMesh);

        var blockMesh = new THREE.Mesh(this.blockGeometry, this.blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        blockMesh.rotation.set(1.57, 0, 0);
        blockMesh.name = "Duck:Block_0";

        this.group.add(blockMesh);

        const wingsGeometryRIGHT = new THREE.BoxGeometry(0.1, 1.1, 0.4);
        const wingsRIGHT = new THREE.Mesh(wingsGeometryRIGHT, this.skinMaterial);
        wingsRIGHT.castShadow = true;
        wingsRIGHT.receiveShadow = true;
        wingsRIGHT.position.set(0.6, 0, -0.2);       
        wingsRIGHT.rotation.set(0.5, 0, -0.8);
        blockMesh.add(wingsRIGHT);

        const wingsGeometryLEFT = new THREE.BoxGeometry(0.1, 1.1, 0.4);
        const wingsLEFT = new THREE.Mesh(wingsGeometryLEFT, this.skinMaterial);
        wingsLEFT.castShadow = true;
        wingsLEFT.receiveShadow = true;
        wingsLEFT.position.set(-0.6, 0, -0.2);      
        wingsLEFT.rotation.set(0.5, 0, 0.8);
        blockMesh.add(wingsLEFT);




        const head = new THREE.Group();
        head.position.set(0, 1.5, -0.7);       
        head.rotation.set(0, Math.PI, 0);
        this.group.add(head);

        const faceGeometryUP = new THREE.SphereGeometry(0.59, 0.2, 0.5);
        const faceUP = new THREE.Mesh(faceGeometryUP, this.skinMaterial);
        faceUP.castShadow = true;
        faceUP.receiveShadow = true;
        faceUP.position.z = -0.2;
        faceUP.position.y = -0.5;
        head.add(faceUP);
        

        const faceGeometryDOWN = new THREE.BoxGeometry(0.5, 0.05, 0.4);
        const faceDOWN = new THREE.Mesh(faceGeometryDOWN, this.orangeMaterial);
        faceDOWN.castShadow = true;
        faceDOWN.receiveShadow = true;
        faceDOWN.position.set(0, -0.7, 0.35);
        // faceDOWN.rotation.set(0.1, 0, 0);        
        faceDOWN.rotation.set(0.5, 0, 0);
        head.add(faceDOWN);

        const faceGeometryDOWN2 = new THREE.BoxGeometry(0.5, 0.05, 0.4);
        const faceDOWN2 = new THREE.Mesh(faceGeometryDOWN2, this.orangeMaterial);
        faceDOWN2.castShadow = true;
        faceDOWN2.receiveShadow = true;
        faceDOWN2.position.set(0, -0.8, 0.3);
        // faceDOWN.rotation.set(0.1, 0, 0);        
        faceDOWN2.rotation.set(0.5, 0, 0);
        head.add(faceDOWN2);

        const eyeGeometryRIGHT = new THREE.SphereGeometry(0.15,0.2,0.2);
        const eyeRIGHT = new THREE.Mesh(eyeGeometryRIGHT, this.whiteMaterial);
        eyeRIGHT.castShadow = true;
        eyeRIGHT.receiveShadow = true;
        eyeRIGHT.position.set(0.2, -0.35, 0.25);
        eyeRIGHT.rotation.set(1.65, 0, 0);
        head.add(eyeRIGHT);

        const eyeGeometryLEFT = new THREE.SphereGeometry(0.15,0.2,0.2);
        const eyeLEFT = new THREE.Mesh(eyeGeometryLEFT, this.whiteMaterial);
        eyeLEFT.castShadow = true;
        eyeLEFT.receiveShadow = true;
        eyeLEFT.position.set(-0.2, -0.35, 0.25);
        eyeLEFT.rotation.set(1.65, 0, 0);
        head.add(eyeLEFT);  

        const pupilGeometryRIGHT = new THREE.SphereGeometry(0.05,0.05,0.05);
        const pupilRIGHT = new THREE.Mesh(pupilGeometryRIGHT, this.blackMaterial);
        pupilRIGHT.castShadow = true;
        pupilRIGHT.receiveShadow = true;
        pupilRIGHT.position.set(0, 0.12, -0.02);
        eyeRIGHT.add(pupilRIGHT);



        const pupilGeometryLEFT = new THREE.SphereGeometry(0.05,0.05,0.05);
        const pupilLEFT = new THREE.Mesh(pupilGeometryLEFT, this.blackMaterial);
        pupilLEFT.castShadow = true;
        pupilLEFT.receiveShadow = true;
        pupilLEFT.position.set(0, 0.12, -0.02);
        eyeLEFT.add(pupilLEFT); 


        const noseGeometryRIGHT = new THREE.CylinderGeometry(0.015, 0.07, 0.2, 8);
        const nosefaceRIGHT = new THREE.Mesh(noseGeometryRIGHT, this.blackMaterial);
        nosefaceRIGHT.castShadow = true;
        nosefaceRIGHT.receiveShadow = true;
        nosefaceRIGHT.position.set(0.05, -0.6, 0.25);
        nosefaceRIGHT.rotation.set(1.65, 0, 0);
        head.add(nosefaceRIGHT);

        const noseGeometryLEFT = new THREE.CylinderGeometry(0.015, 0.07, 0.2, 8);
        const nosefaceLEFT = new THREE.Mesh(noseGeometryLEFT, this.blackMaterial);
        nosefaceLEFT.castShadow = true;
        nosefaceLEFT.receiveShadow = true;
        nosefaceLEFT.position.set(-0.05, -0.6, 0.25);
        nosefaceLEFT.rotation.set(1.65, 0, 0);
        head.add(nosefaceLEFT);  



        this.group.position.x = this.position.x;
        this.group.position.y = this.position.y;
        this.group.position.z = this.position.z;
        if(selectWorld != 0)
            game.scene.add(this.group);

        this.blocks = 1; // adding first Duck

    }

    addDuck() {

        /*
        var blockMesh = new THREE.Mesh(this.blockGeometry, this.blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        blockMesh.name = "Duck_" + this.blocks; // nomina gli Duck_2, Duck_3 ecc.. 

        // bisogna controllare che non si sovrappongano uova sulla stessa posizione
        blockMesh.position.x = Math.random(-10)*10;
        blockMesh.position.y = 2;
        blockMesh.position.z = 15;

        this.group.add(blockMesh);
        
        this.blocks++;

        globalKeyPressed = null;
        */
        duck = new Duck(new THREE.Vector3(Math.random(-10) * 10, 2, Math.random(-10) * 10));
        duck.build();

        globalKeyPressed = null;

    }

    update() {
        var t = game.timer.getElapsedTime();

        // this.group.rotation.y = t * 16 / (2 * Math.PI);
        // this.group.rotation.z = t * 10 / (2 * Math.PI);
        // this.group.rotation.x = t * 35 / (2 * Math.PI);

        this.group.children[1].children[1].rotation.z += Math.sin(3 * t) / 100;
        this.group.children[1].children[0].rotation.z += Math.sin(3 * t) / 100;
        this.group.children[2].children[1].rotation.x += Math.sin(3 * t) / 100;
        this.group.children[2].children[2].rotation.x +=  -Math.sin(3 * t) / 100;
        this.group.children[1].rotation.x += Math.sin(3 * t) / 300;
        this.group.children[2].rotation.y += Math.sin(3 * t) / 150;
    }
}
