/**
 * Created by DrTone on 04/12/2014.
 */
//Visualisation framework

var brainData = (function() {
    //Brain zones
    var brainZones = ['AF3', 'F7', 'F3', 'FC5', 'T7', 'P7', 'O1', 'O2', 'P8', 'T8', 'FC6', 'F4', 'F8', 'AF4'];

    var brainTextData = [];
    var brainRecord = {};
    for (var i = 0; i < brainZones.length; ++i) {
        brainRecord = {zone: brainZones[i]};
        brainTextData.push(brainRecord);
    }

    //Public access to these
    return {
        getNumZones: function () {
            return brainZones.length;
        },

        getBrainData: function () {
            return brainTextData;
        },

        getZoneName: function (zone) {
            if (zone < 0 || zone >= brainZones.length) return null;

            return brainZones[zone];
        }
    }
})();

//Init this app from base
var RANDOM_FIRE_TIME = 1;
var ALPHA_TRANSITION_TIME = 20;
var ALPHA_STEADY_TIME = 10;
//Alpha states
var DOWN=0, OFF=1, UP=2, ON=3;

function Future() {
    BaseApp.call(this);
}

Future.prototype = new BaseApp();

Future.prototype.init = function(container) {
    //Animation
    this.rotInc = 0.002;
    this.glowTime = 0;
    this.delta = 0;
    this.dataTime = 0;
    this.brainModel = null;
    this.currentAlphaState = DOWN;
    this.opacityTime = 0;
    this.brainTime = 0;
    this.startUpCheck = true;

    //Subscribe to pubnub
    this.channel = PubNubBuffer.subscribe("mayhempaul",
        "sub-c-2eafcf66-c636-11e3-8dcd-02ee2ddab7fe",
        1000,
        300);

    BaseApp.prototype.init.call(this, container);

    //GUI
    this.guiControls = null;
    this.gui = null;

    this.barTime = 0;
};

Future.prototype.createScene = function() {
    //Create scene
    BaseApp.prototype.createScene.call(this);

    //Place marker where light is
    var boxGeom = new THREE.BoxGeometry(2, 2, 2);
    var boxMat = new THREE.MeshBasicMaterial( {color: 0xffffff});
    var box = new THREE.Mesh(boxGeom, boxMat);
    box.name = 'lightBox';
    var light = this.scene.getObjectByName('PointLight', true);
    if(light) {
        box.position.copy(light.position);
    }

    this.scene.add(box);

    //Root node
    this.root = new THREE.Object3D();
    this.root.name = 'root';
    this.scene.add(this.root);

    //Load brain model
    this.modelLoader = new THREE.OBJLoader();
    var _this = this;

    //Create 14 spheres for brain zones
    var sphere;
    var sphereMat;
    var sphereMesh;
    var sprite;
    var spriteMat;
    this.spriteMats = [];

    var zonePositions = [];
    var numZones = brainData.getNumZones();
    for(var i=0; i<numZones; ++i) {
        zonePositions.push(new THREE.Vector3());
    }
    //AF3
    zonePositions[0].x = 20;
    zonePositions[0].y = 60;
    zonePositions[0].z = 80;
    //F7
    zonePositions[1].x = 55;
    zonePositions[1].y = 10;
    zonePositions[1].z = 100;
    //F3
    zonePositions[2].x = 30;
    zonePositions[2].y = 70;
    zonePositions[2].z = 70;
    //FC5
    zonePositions[3].x = 40;
    zonePositions[3].y = 30;
    zonePositions[3].z = 60;
    //T7
    zonePositions[4].x = 65;
    zonePositions[4].y = -20;
    zonePositions[4].z = 0;
    //P7
    zonePositions[5].x = 55;
    zonePositions[5].y = -10;
    zonePositions[5].z = -30;
    //O1
    zonePositions[6].x = 20;
    zonePositions[6].y = 0;
    zonePositions[6].z = -70;
    //AF4
    zonePositions[13].x = -20;
    zonePositions[13].y = 60;
    zonePositions[13].z = 80;
    //F8
    zonePositions[12].x = -55;
    zonePositions[12].y = 10;
    zonePositions[12].z = 100;
    //F4
    zonePositions[11].x = -30;
    zonePositions[11].y = 70;
    zonePositions[11].z = 70;
    //FC6
    zonePositions[10].x = -40;
    zonePositions[10].y = 30;
    zonePositions[10].z = 60;
    //T8
    zonePositions[9].x = -65;
    zonePositions[9].y = -20;
    zonePositions[9].z = 0;
    //P8
    zonePositions[8].x = -55;
    zonePositions[8].y = -10;
    zonePositions[8].z = -30;
    //O2
    zonePositions[7].x = -20;
    zonePositions[7].y = 0;
    zonePositions[7].z = -70;

    var texture = THREE.ImageUtils.loadTexture('images/glowRed.png');

    this.sphereScale = 0.5;
    for(var i=0; i<numZones; ++i) {
        sphere = new THREE.SphereGeometry(5, 8, 8);
        //sphereMat = this.glowRedMat;
        sphereMat = new THREE.MeshPhongMaterial( {color: 0xff0000});
        sphereMesh = new THREE.Mesh(sphere, sphereMat);
        sphereMesh.scale.multiplyScalar(this.sphereScale);
        sphereMesh.name = brainData.getZoneName(i);
        sphereMesh.position.set(zonePositions[i].x, zonePositions[i].y, zonePositions[i].z);

        //Add sprite to each mesh
        spriteMat = new THREE.SpriteMaterial( {map: texture, useScreenCoordinates: false, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthTest: false});
        sprite = new THREE.Sprite(spriteMat);
        this.spriteMats.push(spriteMat);
        sprite.scale.set(100, 100, 1);
        sphereMesh.add(sprite);
        this.root.add(sphereMesh);
    }

    this.modelLoader.load( 'models/newBrain.obj', function ( object ) {

        _this.root.add( object );
        _this.loadedModel = object;
        //Apply material to object
        object.traverse( function(child) {
            if(child instanceof THREE.Mesh) {
                child.name = 'brain';
                _this.brainModel = child;
                child.material = new THREE.MeshPhongMaterial( { color: 0xff0000, transparent:true, opacity: 0.25});
            }
        })
    } );

    barManager.createBars('tempCanvas');
};

Future.prototype.createGUI = function() {
    //GUI - using dat.GUI
    this.guiControls = new function() {
        this.SphereSize = 0.5;
        this.BrainOpacity = 0.25;
        this.CycleOpacity = false;
        this.GlowOpacity = 0.7;
        this.RotateSpeed = 0.002;
        this.SinewaveData = false;
        this.RandomData = false;
        this.NeuroData = true;
        //Light Pos
        this.LightX = 200;
        this.LightY = 200;
        this.LightZ = 200;
    };

    //Create GUI
    this.gui = new dat.GUI();

    var _this = this;
    this.gui.add(this.guiControls, 'SphereSize', 0.1, 2).onChange(function(value) {
        _this.onSphereChange(value);
    });
    this.gui.add(this.guiControls, 'BrainOpacity', 0, 1).onChange(function(value) {
        _this.onBrainOpacity(value);
    });
    this.gui.add(this.guiControls, 'CycleOpacity', false);
    this.gui.add(this.guiControls, 'GlowOpacity', 0, 1).onChange(function(value) {
        _this.onGlowOpacity(value);
    });
    this.gui.add(this.guiControls, 'RotateSpeed', 0, 0.02).onChange(function(value) {
        _this.rotInc = value;
    });
    var sineData = this.gui.add(this.guiControls, 'SinewaveData', false).onChange(function(value) {
        //Ensure no other data generation
        if(value) {
            _this.guiControls.NeuroData = false;
            _this.guiControls.RandomData = false;
        }
    });
    sineData.listen();

    var randomData = this.gui.add(this.guiControls, 'RandomData', false).onChange(function(value) {
        //Ensure no other data generation
        if(value) {
            _this.guiControls.NeuroData = false;
            _this.guiControls.SinewaveData = false;
        }
    });
    randomData.listen();

    var NeuroData = this.gui.add(this.guiControls, 'NeuroData', false).onChange(function(value) {
        //Turn off other data generation
        if(value) {
            _this.guiControls.SinewaveData = false;
            _this.guiControls.RandomData = false;
        }
    });
    NeuroData.listen();

    this.lightPos = this.gui.addFolder('LightPos');
    this.lightPos.add(this.guiControls, 'LightX', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, -1);
    });
    this.lightPos.add(this.guiControls, 'LightY', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, 0);
    });
    this.lightPos.add(this.guiControls, 'LightZ', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, 1);
    });
};

Future.prototype.onSphereChange = function(value) {
    //Change size of all spheres
    var sphere;
    for(var i=0; i<brainData.getNumZones(); ++i) {
        sphere = this.scene.getObjectByName(brainData.getZoneName(i), true);
        if(sphere) {
            sphere.scale.set(value, value, value);
        }
    }
};

Future.prototype.onBrainOpacity = function(value) {
    //Change brain opacity
    var brain = this.scene.getObjectByName('brain', true);
    if(brain) {
        brain.material.opacity = value;
    }
};

Future.prototype.onGlowOpacity = function(value) {
    //Change glow opacity
    for(var i=0; i<this.spriteMats.length; ++i) {
        this.spriteMats[i].opacity = value;
    }
};

Future.prototype.changeLightPos = function(value, axis) {
    //Change light pos
    var light = this.scene.getObjectByName('PointLight', true);
    var box = this.scene.getObjectByName('lightBox', true);
    if(!light || !box) {
        console.log('No light or light box');
        return;
    }
    switch(axis) {
        case -1:
            //X-axis
            light.position.x = value;
            box.position.x = value;
            break;

        case 0:
            //Y-Axis
            light.position.y = value;
            box.position.y = value;
            break;

        case 1:
            //Z-Axis
            light.position.z = value;
            box.position.z = value;
            break;

        default:
            break;
    }
};

Future.prototype.update = function() {
    //Perform any updates
//Update data
    this.delta = this.clock.getDelta();
    var mats = null;

    if(this.guiControls.SinewaveData) {
        for(mats=0; mats<this.spriteMats.length; ++mats) {
            this.spriteMats[mats].opacity = (Math.sin(this.glowTime)/2.0) + 0.5;
        }

    }

    if(this.guiControls.NeuroData) {
        if(this.startUpCheck) {
            this.brainTime += this.delta;
        }
        for(mats=0; mats<this.spriteMats.length; ++mats) {
            this.lastData = this.channel.getLastValue(brainData.getZoneName(mats));
            this.receivedData = this.lastData != undefined;
            if(this.receivedData) {
                this.spriteMats[mats].opacity = this.lastData;
                this.brainTime = 0;
                this.startUpCheck = false;
            } else {
                if(this.brainTime >= 5 && this.startUpCheck) {
                    this.guiControls.SinewaveData = true;
                    this.guiControls.NeuroData = false;
                    this.brainTime = 0;
                    this.startUpCheck = false;
                }
            }
        }
    }

    if(this.guiControls.RandomData) {
        this.dataTime += this.delta;
        if(this.dataTime > RANDOM_FIRE_TIME) {
            this.dataTime = 0;
            for(mats=0; mats<this.spriteMats.length; ++mats) {
                this.spriteMats[mats].opacity = Math.random();
            }
            barManager.drawBars(0, this.spriteMats[0].opacity);
        }
    }

    if(this.guiControls.CycleOpacity) {
        switch(this.currentAlphaState) {
            case DOWN:
                if(this.opacityTime == 0) {
                    this.opacityTime = this.guiControls.BrainOpacity * ALPHA_TRANSITION_TIME;
                }
                this.opacityTime -= this.delta;
                if(this.opacityTime <= 0){
                    this.opacityTime = 0;
                    this.currentAlphaState = OFF;
                }
                this.brainModel.material.opacity = this.opacityTime / ALPHA_TRANSITION_TIME;
                break;
            case OFF:
                this.opacityTime += this.delta;
                if(this.opacityTime >= ALPHA_STEADY_TIME) {
                    this.opacityTime = 0;
                    this.currentAlphaState = UP;
                }
                break;
            case UP:
                this.opacityTime += this.delta;
                if(this.opacityTime >= ALPHA_TRANSITION_TIME) {
                    this.opacityTime = 0;
                    this.currentAlphaState = ON;
                    this.brainModel.material.opacity = 1.0;
                } else {
                    this.brainModel.material.opacity = this.opacityTime / ALPHA_TRANSITION_TIME;
                }
                break;
            case ON:
                this.opacityTime += this.delta;
                if(this.opacityTime >= ALPHA_STEADY_TIME) {
                    this.opacityTime = ALPHA_TRANSITION_TIME;
                    this.currentAlphaState = DOWN;
                }
                break;
        }
    }

    this.glowTime += 0.1;

    //Rotate brain model
    if(this.loadedModel) {
        this.root.rotation.y += this.rotInc;
    }

    BaseApp.prototype.update.call(this);
};

$(document).ready(function() {
    //Initialise app
    var container = document.getElementById("WebGL-output");
    var app = new Future();
    app.init(container);
    app.createScene();
    app.createGUI();

    //GUI callbacks

    app.run();
});