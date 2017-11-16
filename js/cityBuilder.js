//namespace
var buildCity = {

//basic setup
scene: new THREE.Scene(),
camera: new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000),
camD: 1,
renderer:  new THREE.WebGLRenderer(),
textures: [], //array of textures loaded by user
minHeight: 3,
maxHeight: 10,
numBuildings: 150,
buildingXSpacing: 4, //spacing between buildings in x direction
buildingZSpacing: 4, //spacing getween buildings in the z direction
cityWidth : 20, //effects how wide the entire city may be
buildings: [],
texture: null,
control: null, //specifies the user interaction with scene

//initialize render, camera, and controls
init: function()
{
	buildCity.renderer.setSize(window.innerWidth, window.innerHeight);
	buildCity.renderer.setClearColor(0x472352);
	document.getElementById('city').appendChild(buildCity.renderer.domElement);
	buildCity.camera.position.z = 34;
	buildCity.camera.position.y = 5;

	buildCity.initControler();
	buildCity.getTexture();

},
//TODO: impliment computer generated textures
getTexture: function()
{


},

//reset scene for creation of a new city
clear: function()
{
		buildCity.buildings = []
		while(buildCity.scene.children.length > 0)
		{
			buildCity.scene.remove(buildCity.scene.children[0]);
		}

},

//initialize user scene movement
initControler: function()
{
	buildCity.controls = new THREE.TrackballControls( buildCity.camera );

	buildCity.controls.rotateSpeed = 1.0;
	buildCity.controls.zoomSpeed = 1.2;
	buildCity.controls.panSpeed = 0.8;

	buildCity.controls.noZoom = false;
	buildCity.controls.noPan = false;

	buildCity.controls.staticMoving = true;
	buildCity.controls.dynamicDampingFactor = 0.3;

	buildCity.controls.keys = [ 65, 83, 68 ];


},

//create a rectangle based building
getRandBoxMesh: function()
{

	height = Math.floor(Math.random()* buildCity.maxHeight) + buildCity.minHeight;
	depth = Math.floor(Math.Random * 4) + 1;
	width = Math.floor(Math.Random * 4) + 1;
	var index = Math.floor(Math.random() * parseInt(buildCity.textures.length))
	var texturLoader = new THREE.TextureLoader();
	var texture = texturLoader.load(buildCity.textures[index])
	var topTexture = texturLoader.load("Textures/roof.jpg")
	var materials = [
		new THREE.MeshLambertMaterial({map: texture }),
		new THREE.MeshLambertMaterial({map: texture }),
		new THREE.MeshLambertMaterial({map: topTexture }),
		new THREE.MeshLambertMaterial({map: texture }),
		new THREE.MeshLambertMaterial({map: texture }),
		new THREE.MeshLambertMaterial({map: texture })
	];
	geom = new THREE.BoxGeometry(width, height, depth);
	mesh = new THREE.Mesh(geom, materials);
	mesh.position.y = height/2
	return mesh

},

//give each building in the array its scene position
positionBuildings: function(buildings)
{
	var seed = Math.floor(Math.random() * 2) + 1;
	var z = -buildCity.cityWidth;
	var x = -buildCity.cityWidth;
	var increaser = 2;
	if(seed == 1)
	{
	for(var i = 0; i < buildCity.buildings.length; i++)
	{
		if (x < buildCity.cityWidth)
		{
			x+= buildCity.buildingXSpacing;

		}
		else
		{
			x =  -buildCity.cityWidth;
			z+=buildCity.buildingZSpacing;

		}
		buildCity.buildings[i].position.x = x;
		buildCity.buildings[i].position.z = z;
		//buildCity.buildings[i].position.y = 0;
		buildCity.scene.add(buildCity.buildings[i]);
	}
}
	else {
		for(var i = 0; i < buildCity.buildings.length; i++)
		{
			if (x < buildCity.cityWidth)
			{
				x+= buildCity.buildingXSpacing;

			}
			else
			{
				x = increaser * -buildCity.cityWidth;
				z+=buildCity.buildingZSpacing;
				increaser +=0.2;
			}
			buildCity.buildings[i].position.x = x;
			buildCity.buildings[i].position.z = z;
			//buildCity.buildings[i].position.y = 0;
			buildCity.scene.add(buildCity.buildings[i]);
		}
			buildCity.camera.position.x +=5
			buildCity.camera.position.z -= 15
	}




},
//create cylinder geometry based building
getRandCylinderMesh: function()
{
	radius = Math.floor(Math.random() * 3) + 1;
	height = Math.floor(Math.random() * buildCity.maxHeight) + buildCity.minHeight;
	segments = Math.floor(Math.random() * 3) + 3;
	var materials = [];
	var index = Math.floor(Math.random() * parseInt(buildCity.textures.length))

	geom = new THREE.CylinderGeometry(radius,radius, height, segments);
	materials.push(new THREE.MeshLambertMaterial({map:  new THREE.TextureLoader().load(buildCity.textures[index])}));
	materials.push(new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("Textures/roof.jpg")}));
	mesh = new THREE.Mesh(geom, materials);
	mesh.position.y = height/2;

	return mesh;
},

//BoxGeometry that holds the city
generateSkyBox: function()
{
	var geom = new THREE.BoxGeometry(500,500,500,1,1,1)
	var texturLoader = new THREE.TextureLoader();
	var texture = texturLoader.load("Textures/sky.jpg")
	materials = []
	var material = new THREE.MeshBasicMaterial({map: texture,side: THREE.DoubleSide});

	for(var i = 0; i< 3; i++)
		materials.push(material);

		texture = texturLoader.load("Textures/desert.jpg")
		material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
		materials.push(material);
		texture = texturLoader.load("Textures/sky.jpg")
		material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
		materials.push(material);
		texture = texturLoader.load("Textures/sky.jpg")
		material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, });
		materials.push(material)

	var skyBox = new THREE.Mesh(geom, materials);
	skyBox.position.y = 250;
	buildCity.scene.add(skyBox);
},
//crate buildings
generateBuildings: function()
{
	for(var i = 0; i < buildCity.numBuildings; i++)
	{
		var rand = Math.floor(Math.random() * 2) + 1
		if(rand == 1)
		{
			buildCity.buildings.push(buildCity.getRandCylinderMesh());
		}

		else
		{
				buildCity.buildings.push(buildCity.getRandBoxMesh());
		}

		buildCity.scene.add(buildCity.buildings[i])
	}

	buildCity.positionBuildings();
	buildCity.generateSkyBox();


},

create: function(numBuildings,minHeight, maxHeight, buildingSpacing, buildingZSpacing, cityWidth, textures)
{

	//Error Checking
	if(!minHeight < 1)
	{
		buildCity.minHeight = minHeight;
	}
	if(!maxHeight <= minHeight)
	{
		buildCity.maxHeight = maxHeight;
	}
	if(numBuildings >= 1)
	{
		buildCity.numBuildings = numBuildings;
	}
	buildCity.textures = textures;
	if(buildingSpacing != null)
		buildCity.buildingXSpacing = buildingSpacing;
	if(buildingZSpacing!= null)
		buildCity.buildingZSpacing = buildingZSpacing;
		if(cityWidth !=null)
		buildCity.cityWidth = cityWidth;

	 buildCity.buildings = buildCity.generateBuildings();

	//(sky color, ground color, light intensisty)
	var light = new THREE.HemisphereLight(0x98eff5, 0xe3bc52, .7)
	light.castShadow = true;
	light.position.set(buildCity.cityWidth/2,buildCity.numBuildings/2.5,buildCity.cityWidth/2)
	buildCity.scene.add(light)
	buildCity.animate();
},

animate: function() //redner loop
{
	requestAnimationFrame(buildCity.animate);
	buildCity.renderer.render(buildCity.scene, buildCity.camera)
	buildCity.controls.update();

}
};
