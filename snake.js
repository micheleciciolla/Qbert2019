var move = 1;

class Snake
{
    constructor()
    {
        this.snakeLenght = 0;

        this.snakePosition = new THREE.Vector3(0, 1, 0);
        this.snakeRotation = new THREE.Vector3(0, 0, 0);

        this.snakeGroup = new THREE.Group();
        this.snakeGroup.name = "SnakeGroup";
        this.blockGeometry = new THREE.CubeGeometry(1, 1);
        this.blockMaterial = new THREE.MeshPhongMaterial({
            color: 0xAAFF55, 
            wireframe: false,
            depthTest: true,
        });
        this.rayCaster = new THREE.Raycaster();

        // this is a dictionary containing an history of position of head
        this.headHistory = {};

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
        
        
        var headGeometry = new THREE.CubeGeometry(1, 1);
        var headMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFFF00, 
            wireframe: false,
            depthTest: true,
        });
        
        var headMesh = new THREE.Mesh(headGeometry, headMaterial);
        headMesh.castShadow = true;
        headMesh.receiveShadow = true;
        headMesh.name = "Snake:head";

        this.snakeGroup.add(headMesh);
        game.scene.add(this.snakeGroup);

        this.blocks = 1;
        // aggiungo le prime due posizini coincidenti
        this.headHistory[0] = this.snakePosition;
        this.headHistory[1] = this.snakePosition;

    }

    addBlock()
    {   
        // ADD BLOCK CLASSICO
        var blockMesh = new THREE.Mesh(this.blockGeometry, this.blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        blockMesh.position.z = - (1.2 * this.blocks);
        blockMesh.name = "Snake:Tail_" + this.blocks;

        this.snakeGroup.add(blockMesh);
        this.blocks++;

    }

    addBlockEgg(){

        // ADD BLOCK DOPO EAT
        var materiale = new THREE.MeshBasicMaterial( { color: Math.random()*0xffff00 } );
        
        var blockMesh = new THREE.Mesh(this.blockGeometry, materiale);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;

        // Here i understand where to put block according to direction 
        // NB. Just of this.snakeDirection is different from 0

        blockMesh.position.x = - (1.2 * this.blocks)* ( this.snakeDirection.x );
        blockMesh.position.y = - (1.2 * this.blocks)* ( this.snakeDirection.y );
        blockMesh.position.z = - (1.2 * this.blocks)* ( this.snakeDirection.z );

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
        else this.blockMaterial.color = new THREE.Color("rgb(255, 0, 0)");

    }

    redAlert(){

        // quando snake perde un blocco il suo corpo per un secondo è red

        // TO-DO
    }

    swag(delta){
        // genera movimento sinusoidale snake
        for(var i=0; i<this.blocks; i++)
        {   
            this.snakeGroup.children[i].position.x = 0.25 * Math.cos(delta + i);
        }
    }

    move(x, y, z){
        
        //this.headHistory.

        this.snakeGroup.position.x += x;
        this.snakeGroup.position.y += y;
        this.snakeGroup.position.z += z;

        /*
        for(var i=1; i<this.blocks; i++)
        {
            this.snakeGroup.children[i].position.x = this.snakeGroup.children[i-1].position.x;
            this.snakeGroup.children[i].position.y = this.snakeGroup.children[i-1].position.y;
            this.snakeGroup.children[i].position.z = this.snakeGroup.children[i-1].position.z;
        }
        */
        
    }

    setPosition(pos, value){
        if(pos == "x")
            this.snakeGroup.position.x = value;

        if(pos == "y")
            this.snakeGroup.position.y = value;

        if(pos == "z")
            this.snakeGroup.position.z = value;
    }

    setOrientation(x, y, z) {

        // used to set orientation of snake head
        this.snakeDirection = new THREE.Vector3(x, y, z);
    }

    update(){

        switch(globalKeyPressed)
        {   
            // [ W ]
            case(87):
                snake.move(0, 0, +move);
                snake.setOrientation(0,0,1);
                break;

            // [ S ] 
            case(83):
                snake.move(0, 0, -move);
                snake.setOrientation(0,0,-1);

                break;

            // [A]
            case(65):
                snake.move(+move, 0, 0);
                snake.setOrientation(+1,0,0);

                break;

            // [ D ]
            case(68):
                snake.move(-move, 0, 0);
                snake.setOrientation(-1,0,0);

                break;
            
            // shift = add 1
            case(16):
                snake.addBlockEgg();
                break;
            
            // MAIUSC = add 2
            case(20):
                snake.addBlockEgg();
                snake.addBlockEgg();
                break;  
                
            // spacebar = remove 1
            case(32):
                snake.redRemoveBlock();
                break;

        }
        
    }
};
