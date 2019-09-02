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
        this.rayCaster = new THREE.Raycaster();
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
        
        
        var headGeometry = new THREE.DodecahedronBufferGeometry(1);
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
    }

    addBlock()
    {   
        // ADD BLOCK CLASSICO
        var blockMesh = new THREE.Mesh(this.blockGeometry, this.blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        blockMesh.position.z = - (1.1 * this.blocks);
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
        blockMesh.position.z = - (1.1 * this.blocks);
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
        
        // testa
        this.snakeGroup.position.x += x;
        this.snakeGroup.position.y += y;
        this.snakeGroup.position.z += z;
        
        // primo blocco
        
        this.snakeGroup.children[0].rotation.x += Math.sin(x);
        this.snakeGroup.children[0].rotation.y += Math.sin(y);
        this.snakeGroup.children[0].rotation.z += Math.sin(z);
        
        /*
        for(var i=1; i<this.blocks; i++)
        {
            this.snakeGroup.children[i].rotation.x -= Math.sin(x);
            this.snakeGroup.children[i].rotation.y -= Math.sin(y);
            this.snakeGroup.children[i].rotation.z -= Math.sin(z);
        }
        */
    }

    checkCollision()
    {
        /*
        // Check gravity
        var gravityDir = new THREE.Vector3(0, 0, 0);
        gravityDir.x = this.snakeGroup.position.x;
        gravityDir.y = -1.5;
        gravityDir.z = this.snakeGroup.position.z;

        this.rayCaster.set(this.snakeGroup.position, gravityDir);
        var intersects = this.rayCaster.intersectObjects( game.scene.children );
        
        if(intersects.length != 0)
        {
            for(var i=0; i<intersects.length; i++)
            {
                if( intersects[i].object.name == "Ground" &&
                    intersects[i].distance < 1.5)
                {
                    this.move(0, 0.1, 0);
                    continue;
                }
            }
        }
        else
        {
            if(this.snakeGroup.position.y > 2.5 && this.snakeGroup.position.y < 1.5)
                this.move(0, -0.1, 0);
        }
        */
        var faceDir = new THREE.Vector3(0, 0, 0);
        faceDir.x = this.snakeGroup.position.x;
        faceDir.y = this.snakeGroup.position.y;
        faceDir.z = this.snakeGroup.position.z;

        this.rayCaster.set(this.snakeGroup.position, faceDir);
        var intersects = this.rayCaster.intersectObjects( game.scene.children );

        //console.log("faceDir: ", faceDir);
        //console.log("Group position: ", this.snakeGroup.position);
        if(intersects.length != 0){       
            console.log(intersects);

            for(var i=0; i<intersects.length; i++)
            {
                if( intersects[i].object.name == "FoodGroup" )
                {
                    console.log("OK");
                    //game.scene.del(game.scene.getObjectByName("FoodGroup"));
                    this.addBlock();
                    continue;
                }
            }
        }
    }

    setPosition(pos, value){
        if(pos == "x")
            this.snakeGroup.position.x = value;

        if(pos == "y")
            this.snakeGroup.position.y = value;

        if(pos == "z")
            this.snakeGroup.position.z = value;
    }

    update(){
        switch(globalKeyPressed)
        {
            case(87):
                snake.move(0, 0, +0.1);
                break;

            case(83):
                snake.move(0, 0, -0.1);
                break;

            case(65):
                snake.move(+0.1, 0, 0);
                break;
            
            case(68):
                snake.move(-0.1, 0, 0);
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
        
        this.checkCollision();
    }
};
