var move = 0.15; // velocity of snake (used in moveHead)

class Snake
{
    constructor()
    {
        this.snakeLenght = 0;
        this.snakePosition = new THREE.Vector3(0, 2, 0);
        this.snakeRotation = new THREE.Vector3(0, 0, 0);

        this.snakeGroup = new THREE.Group();
        this.snakeGroup.name = "SnakeGroup";

        this.blockGeometry = new THREE.CubeGeometry(1, 1);
        this.blockMaterial = new THREE.MeshPhongMaterial({
            color: 0xAAFF55, 
            wireframe: false,
            depthTest: true,
        });

        this.skinMaterial = new THREE.MeshPhongMaterial({
            color: 0xAAFF55, 
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

        this.redMaterial = new THREE.MeshPhongMaterial({
            color: 0xB22222, 
            wireframe: false,
            depthTest: true,
        });         
        this.rayCaster = new THREE.Raycaster();

        // initially snake is oriented vs positive Z axis
        this.snakeDirection = new THREE.Vector3(0, 0, 1);
    }

    buildHead()
    {
        this.snakeLenght = 0;
        
        this.snakeGroup.position.x = this.snakePosition.x;
        this.snakeGroup.position.y = this.snakePosition.y;
        this.snakeGroup.position.z = this.snakePosition.z;

        this.snakeGroup.rotation.x = this.snakeRotation.x;
        this.snakeGroup.rotation.y = this.snakeRotation.y;
        this.snakeGroup.rotation.z = this.snakeRotation.z;
        
        const head = new THREE.Group();
        head.position.set(0, 0.61, 0.5);       
        //head.rotation.set(0, -Math.PI, 0);
        this.snakeGroup.add(head);

        const faceGeometryUP = new THREE.BoxGeometry(1, 0.7, 1.5);
        const faceUP = new THREE.Mesh(faceGeometryUP, this.skinMaterial);
        faceUP.castShadow = true;
        faceUP.receiveShadow = true;
        faceUP.position.z = -0.2;
        faceUP.position.y = -0.5;
        head.add(faceUP);
        
        const faceGeometryDOWN = new THREE.BoxGeometry(1, 0.2, 1.2);
        const faceDOWN = new THREE.Mesh(faceGeometryDOWN, this.skinMaterial);
        faceDOWN.castShadow = true;
        faceDOWN.receiveShadow = true;
        faceDOWN.position.set(0, -1, -0.25);
        // faceDOWN.rotation.set(0.1, 0, 0);        
        faceDOWN.rotation.set(0.5, 0, 0);
        head.add(faceDOWN);

        const toothGeometryRIGHT = new THREE.ConeGeometry( 0.05, 0.2, 32 );
        const toothRIGHT = new THREE.Mesh(toothGeometryRIGHT, this.whiteMaterial);
        toothRIGHT.castShadow = true;
        toothRIGHT.receiveShadow = true;
        toothRIGHT.position.set(0.4, 0.2, 0.5);
        faceDOWN.add(toothRIGHT);

        const toothGeometryLEFT = new THREE.ConeGeometry( 0.05, 0.2, 32 );
        const toothLEFT = new THREE.Mesh(toothGeometryLEFT, this.whiteMaterial);
        toothLEFT.castShadow = true;
        toothLEFT.receiveShadow = true;
        toothLEFT.position.set(-0.4, 0.2, 0.5);
        faceDOWN.add(toothLEFT); 

        /*          
        const tongueGeometry = new THREE.SphereGeometry(0.5,3,6,1.2,0.8,3,2.2);
        const tongue = new THREE.Mesh(tongueGeometry, this.redMaterial);
        tongue.castShadow = true;
        tongue.receiveShadow = true;
        tongue.position.set(0, -0.4, 0.5);
        tongue.rotation.set(0, 0, 0);
        head.add(tongue);  
        */

        const tongueGeometry = new THREE.SphereGeometry(0.5,3,6,1.2,0.8,2.5,2.6);
        const tongue = new THREE.Mesh(tongueGeometry, this.redMaterial);
        tongue.castShadow = true;
        tongue.receiveShadow = true;
        tongue.position.set(0, -0.4, 0.5);
        tongue.rotation.set(0, 0, 0);
        head.add(tongue); 

        /*         
        const tongueGeometry = new THREE.SphereGeometry(0.5,3,6,1.2,0.8,2,3);
        const tongue = new THREE.Mesh(tongueGeometry, this.redMaterial);
        tongue.castShadow = true;
        tongue.receiveShadow = true;
        tongue.position.set(0, -0.4, 0.5);
        tongue.rotation.set(0, 0, 0);
        head.add(tongue);
        */

        const eyeGeometryRIGHT = new THREE.SphereGeometry(0.2,0.2,0.2);
        const eyeRIGHT = new THREE.Mesh(eyeGeometryRIGHT, this.whiteMaterial);
        eyeRIGHT.castShadow = true;
        eyeRIGHT.receiveShadow = true;
        eyeRIGHT.position.set(0.5, -0.45, 0.15);
        eyeRIGHT.rotation.set(1.65, 0, 0);
        head.add(eyeRIGHT);

        const eyeGeometryLEFT = new THREE.SphereGeometry(0.2,0.2,0.2);
        const eyeLEFT = new THREE.Mesh(eyeGeometryLEFT, this.whiteMaterial);
        eyeLEFT.castShadow = true;
        eyeLEFT.receiveShadow = true;
        eyeLEFT.position.set(-0.5, -0.45, 0.15);
        eyeLEFT.rotation.set(1.65, 0, 0);
        head.add(eyeLEFT);  

        const pupilGeometryRIGHT = new THREE.SphereGeometry(0.05,0.05,0.05);
        const pupilRIGHT = new THREE.Mesh(pupilGeometryRIGHT, this.blackMaterial);
        pupilRIGHT.castShadow = true;
        pupilRIGHT.receiveShadow = true;
        pupilRIGHT.position.set(0.18, 0, 0);
        eyeRIGHT.add(pupilRIGHT);

        const pupilGeometryLEFT = new THREE.SphereGeometry(0.05,0.05,0.05);
        const pupilLEFT = new THREE.Mesh(pupilGeometryLEFT, this.blackMaterial);
        pupilLEFT.castShadow = true;
        pupilLEFT.receiveShadow = true;
        pupilLEFT.position.set(-0.18, 0, 0);
        eyeLEFT.add(pupilLEFT); 

        const noseGeometryRIGHT = new THREE.CylinderGeometry(0.07, 0.07, 0.2, 8);
        const nosefaceRIGHT = new THREE.Mesh(noseGeometryRIGHT, this.blackMaterial);
        nosefaceRIGHT.castShadow = true;
        nosefaceRIGHT.receiveShadow = true;
        nosefaceRIGHT.position.set(0.15, -0.45, 0.5);
        nosefaceRIGHT.rotation.set(1.65, 0, 0);
        head.add(nosefaceRIGHT);

        const noseGeometryLEFT = new THREE.CylinderGeometry(0.07, 0.07, 0.2, 8);
        const nosefaceLEFT = new THREE.Mesh(noseGeometryLEFT, this.blackMaterial);
        nosefaceLEFT.castShadow = true;
        nosefaceLEFT.receiveShadow = true;
        nosefaceLEFT.position.set(-0.15, -0.45, 0.5);
        nosefaceLEFT.rotation.set(1.65, 0, 0);
        head.add(nosefaceLEFT);  

/*         
        const woolGeometry = new THREE.BoxGeometry(0.84, 0.46, 0.9);
        const wool = new THREE.Mesh(woolGeometry, this.woolMaterial);
        wool.position.set(0, 0.12, 0.07);
        head.add(wool);
        
        const rightEyeGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.06, 6);
        const rightEye = new THREE.Mesh(rightEyeGeometry, this.darkMaterial);
        rightEye.castShadow = true;
        rightEye.receiveShadow = true;
        rightEye.position.set(0.35, -0.48, 0.33);
        rightEye.rotation.set(0, 0, 0);
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
        this.rightEar.rotation.set(0,0,0);
        head.add(this.rightEar);
        
        this.leftEar = this.rightEar.clone();
        this.leftEar.position.x = -this.rightEar.position.x;
        this.leftEar.rotation.z = -this.rightEar.rotation.z;
        head.add(this.leftEar);
 */

        game.scene.add(this.snakeGroup);
        this.blocks = 1;
    }

    addBlock()
    {

        var blockMesh = new THREE.Mesh(this.blockGeometry, this.blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        blockMesh.position.z =  - (1.1 * this.blocks);

        blockMesh.name = "Snake:Tail_" + this.blocks;

        this.snakeGroup.add(blockMesh);
        this.blocks++;

    }

    addBlockEgg(){

    	//TEXTURE
        var texture = new THREE.TextureLoader().load('textures/skin.png');

        // ADD BLOCK DOPO EAT

        var materiale = new THREE.MeshBasicMaterial({ map: texture });
        // var materiale = new THREE.MeshBasicMaterial( { color: Math.random()*0xffff00 } );

        var blockMesh = new THREE.Mesh(this.blockGeometry, materiale);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;

        /*
            per risolvere il problema di quel bug che si vede quando si aggiunge un blocco
            ho impostato che il blocco viene aggiunto "far away in the galaxy"
            cosi poi quando ci si muove la testa li richiama tutti a se
        */

        var farawayinthegalaxy = 300;
        blockMesh.position.x = - (1.2 * this.blocks)* ( this.snakeDirection.x )*farawayinthegalaxy;
        blockMesh.position.y = - (1.2 * this.blocks)* ( this.snakeDirection.y )*farawayinthegalaxy;
        blockMesh.position.z = - (1.2 * this.blocks)* ( this.snakeDirection.z )*farawayinthegalaxy;

        blockMesh.name = "Snake:Tail_" + this.blocks;

        this.snakeGroup.add(blockMesh);
        this.blocks++;

        globalKeyPressed = null;
        
    }
    redRemoveBlock(){

        // la testa non può essere cancellata
        if(this.blocks > 2) {
            this.blocks--;
            this.snakeGroup.remove(this.snakeGroup.children[this.blocks]);
            globalKeyPressed = null;
            // this.redAlert();
        }
        else this.blockMaterial.color = new THREE.Color("rgb(255, 0, 0)"); // temporaneo

    }

    redAlert(){

        // quando snake perde un blocco il suo corpo per un secondo è red

        // TO-DO
    }

    swag(delta){
        // genera movimento sinusoidale snake
        for(var i=1; i<this.blocks; i++)
        {   
            this.snakeGroup.children[i].rotation.z = 0.004 * Math.cos(delta+i);
        }
    }

    setOrientation(x, y, z) {

        this.snakeDirection = new THREE.Vector3(x, y, z);
        
        /*
            Questa sezione qui sotto serve a capire come girare la testa
            in base alla direzione del movimento
        */

        if(z!=0){
            this.snakeGroup.children[0].rotation.z = 0;
            this.snakeGroup.children[0].rotation.y = (1-z)*Math.PI/2;
            this.snakeGroup.children[0].rotation.x = 0;
        }

        if(x!=0){
            this.snakeGroup.children[0].rotation.z = 0;
            this.snakeGroup.children[0].rotation.y = x*Math.PI/2;
            this.snakeGroup.children[0].rotation.x = 0;
        }

        if(y!=0){
            this.snakeGroup.children[0].rotation.z = 0;
            this.snakeGroup.children[0].rotation.x = -y*Math.PI/2;
            this.snakeGroup.children[0].rotation.y = 0;
        }

    }

    rotation(){
        
        this.snakeGroup.children[0].rotation.x += Math.sin(1)/20;
        this.snakeGroup.children[0].rotation.y += Math.sin(1)/20;
        this.snakeGroup.children[0].rotation.z += Math.sin(1)/20;
     
    }

    moveHead(x, y, z){
        /*
            Impartisce i comandi alla testa
            Aggiunto per pulizia e per usi futuri (if WallHit then goRight)
            
        */

        this.snakeGroup.children[0].position.z += z
        this.snakeGroup.children[0].position.y += y
        this.snakeGroup.children[0].position.x += x
    }

    updateBody(x,y,z) {
        /*
            Questo metodo riceve in input le informazione relative alle direzione del serpente
            potrebbero essere utili per sistema la spostamento del corpo

            la parte commentata al lato è un prototipo per sistema lo spostamento del corpo
            se viene decommentata da' l' idea
        */
        
        if (this.snakeGroup.children.length > 1) {
            for (var i = this.snakeGroup.children.length - 1; i > 0; i--) {
                this.snakeGroup.children[i].position.x = this.snakeGroup.children[i - 1].position.x; //  - x*1.1 ;
                this.snakeGroup.children[i].position.y = this.snakeGroup.children[i - 1].position.y; //  - y*1.1 ;
                this.snakeGroup.children[i].position.z = this.snakeGroup.children[i - 1].position.z; //  - z*1.1 ;
                ;
            }
        }
    }

    move() {
        
        switch (globalKeyPressed) {

            /*
                Ho introdotto per pulizia il metodo move head che non fa altro che mandare il comando alla testa
                Viene anche aggiornata la direzione verso cui sta andando il serpente, è utile per scopi futuri
                UpdateBody è un metodo che racchiude il precedente aggiornamento di tutti i nodi dall' ultimo verso il
                primo come era prima. Grazie a questa costruzione l' effetto fisarmonica e' stato rimosso.
            */

            // [ Z ]
            case (90):
                snake.moveHead(0, +move, 0);
                snake.setOrientation(0, +1, 0);
                this.updateBody(0, +1, 0);

                break;

            // [ X ]
            case (88):
                snake.moveHead(0, -move, 0);
                snake.setOrientation(0, -1, 0);
                this.updateBody(0, -1, 0);
                break;
            // [ W ]
            case (87):
                snake.moveHead(0, 0, +move);
                snake.setOrientation(0, 0, 1);
                this.updateBody(0, 0, 1);

                break;

            // [ S ] 
            case (83):
                snake.moveHead(0, 0, -move);
                snake.setOrientation(0, 0, -1);
                this.updateBody(0, 0, -1);

                break;

            // [ A ]
            case (65):
                snake.moveHead(+move, 0, 0);
                snake.setOrientation(+1, 0, 0);
                this.updateBody(+1, 0, 0);

                break;

            // [ D ]
            case (68):
                snake.moveHead(-move, 0, 0);
                snake.setOrientation(-1, 0, 0);
                this.updateBody(-1, 0, 0);

                break;

            // shift = add 1
            case (16):
                snake.addBlockEgg();
                break;

            // MAIUSC = add 2
            case (20):
                snake.addBlockEgg();
                snake.addBlockEgg();
                break;

            // spacebar = remove 1
            case (32):
                snake.redRemoveBlock();
                break;
        }
    }

    update(){
        snake.move();
    }

    setPosition(pos, value)
    {
        if(pos == "x")
            this.snakeGroup.position.x = value;

        if(pos == "y")
            this.snakeGroup.position.y = value;

        if(pos == "z")
            this.snakeGroup.position.z = value;
    }

};
