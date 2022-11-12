# Pixi3D
Pixi3D is a 3D rendering library for the web. It's built on top of PixiJS (which is at it's core, an established 2D rendering library). This makes Pixi3D have seamless integration with already existing 2D applications.

* Load models from file (glTF) or create procedural generated meshes
* Physically-based rendering (PBR) and image-based lighting (IBL)
* Customized materials and shaders
* 3D sprites
* Transformation, morphing and skeletal animations
* Compatible with PixiJS v5, v6 and v7.

![SPY-HYPERSPORT](https://github.com/jnsmalm/pixi3d/blob/develop/spy-hypersport.jpg?raw=true)

*"SPY-HYPERSPORT" (https://skfb.ly/o8z7t) by Amvall is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/). Rendered using Pixi3D.*

## Production ready?
Yes, it's currently being used in multiple projects in production running on hundreds of thousands of different devices (both desktop and mobile).

## Getting started
The easiest way to get started is to use the automatic setup which creates a simple project with everything needed to start immediatly. Node.js must be installed, go to https://nodejs.org to download.

Type in the following using the terminal/console:

```
npx create-pixi3d-app my-pixi3d-app
```
After installation is complete, type `cd my-pixi3d-app` and `npm start` to start local web server.

### Manual setup

- [Download the latest version of Pixi3D](https://github.com/jnsmalm/pixi3d/releases)
- [Download PixiJS](https://github.com/pixijs/pixi.js/releases) (Pixi3D is compatible with all versions from 5.3 and later)

Next, create a file *app.js* with the following contents.

```javascript
let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

let mesh = app.stage.addChild(PIXI3D.Mesh3D.createCube())

let light = new PIXI3D.Light()
light.position.set(-1, 0, 3)
PIXI3D.LightingEnvironment.main.lights.push(light)

let rotation = 0
app.ticker.add(() => {
  mesh.rotationQuaternion.setEulerAngles(0, rotation++, 0)
})
```
Then create *index.html* and include the required scripts.

```html
<!doctype html>
<html lang="en">
<body>
  <script type="text/javascript" src="pixi.js"></script>
  <script type="text/javascript" src="pixi3d.js"></script>
  <script type="text/javascript" src="app.js"></script>
</body>
</html>
```

### Using npm
Pixi3D is also available as a npm package. Install the latest release with `npm install pixi3d`. This requires that an up-to-date version of Node.js is already installed.

If PixiJS v5 or v6 is used, import from *pixi3d* i.e. `import { Model } from "pixi3d"`. If PixiJS v7 is used, instead import from *pixi3d/pixi7* i.e. `import { Model } from "pixi3d/pixi7"`.

## Examples
Examples are available as sandboxes at https://codesandbox.io to quickly get started. Download repo at https://github.com/jnsmalm/pixi3d-sandbox to instead run them locally.

| Example           | Description                                                             | Sandbox |
|-------------------|-------------------------------------------------------------------------|:-------:|
| Getting started | Create application, rotating cube | [View](https://codesandbox.io/s/github/jnsmalm/pixi3d-sandbox/tree/master/getting-started) |
| Standard material | Load glTF model, image-based lighting, physically-based rendering | [View](https://codesandbox.io/s/github/jnsmalm/pixi3d-sandbox/tree/master/standard-material) |
| Animation | Model animation, dynamic shadows | [View](https://codesandbox.io/s/github/jnsmalm/pixi3d-sandbox/tree/master/model-animation) |
| Custom material | Custom material/shader | [View](https://codesandbox.io/s/github/jnsmalm/pixi3d-sandbox/tree/master/custom-material) |
| Sprites | Billboard sprites in 3D space | [View](https://codesandbox.io/s/github/jnsmalm/pixi3d-sandbox/tree/master/sprites-3d) |
| Punctual lights | Directional light, spot light, point light | [View](https://codesandbox.io/s/github/jnsmalm/pixi3d-sandbox/tree/master/punctual-lights) |
| Custom geometry | Mesh with custom vertex attributes | [View](https://codesandbox.io/s/github/jnsmalm/pixi3d-sandbox/tree/master/custom-geometry) |
| Interaction | Mesh picking | [View](https://codesandbox.io/s/github/jnsmalm/pixi3d-sandbox/tree/master/mesh-interaction) |
| Post processing | Post processing sprite with filters | [View](https://codesandbox.io/s/github/jnsmalm/pixi3d-sandbox/tree/master/post-processing-sprite) |

## Quick guide
An introduction to Pixi3D and a overview of the core concepts and components. Go to the [Quick guide sandbox](https://codesandbox.io/s/github/jnsmalm/pixi3d-sandbox/tree/master/quick-guide) to view a real-time demo of the scene created with this guide.

### Creating an application
The quickest way to get started is by creating an PixiJS application object. The application object creates a renderer and automatically starts the render loop. It also creates a canvas element which should be added to the HTML document.

```javascript
let app = new PIXI.Application({
  resizeTo: window, backgroundColor: 0xdddddd, antialias: true
});
document.body.appendChild(app.view);
```
*Creates an application and adds the canvas element which results in an empty 
page with a grey background.*

### Loading a 3D model
A model includes a hierarchy of 3D objects which are called meshes. A mesh contains the geometry and material used for rendering that object. Models are generally being loaded from a file which has been created in a 3D modeling tool like Maya or Blender. Pixi3D supports loading of models using the glTF 2.0 file format. Learn more about glTF at https://www.khronos.org/gltf/

Loading a model is different depending on the PixiJS version used. This is how to do it when using PixiJS v5 or v6.

```javascript
app.loader.add(
  "teapot.gltf",
  "https://raw.githubusercontent.com/jnsmalm/pixi3d-sandbox/master/assets/teapot/teapot.gltf"
);

app.loader.load((_, resources) => {
  setup(resources["teapot.gltf"].gltf);
})

function setup(gltf) {
  let teapot = app.stage.addChild(PIXI3D.Model.from(gltf));
}
```

This is how to do it when using PixiJS v7.

```javascript
// Using a self executing function just to make the different methods more comparable.
(async function load() {
  let gltf = await PIXI.Assets.load("https://raw.githubusercontent.com/jnsmalm/pixi3d-sandbox/master/assets/teapot/teapot.gltf")
  setup(gltf)
})()

function setup(gltf) {
  let teapot = app.stage.addChild(PIXI3D.Model.from(gltf));
}
```
*Loads a glTF 2.0 file and creates a model. The silhouette of a teapot should appear. For now, it will be rendered black because there is no lighting.*

### Position, rotation and scale
All objects in a scene have a transform which is used for setting the position, rotation and scale of that object. The transform of an object is always relative to it's parent transform. So when changing the transform of the parent object, all of it's childrens transforms will be affected as well.

Both position and scale is represented by a vector with three components (x, y, z), one for each axis. Rotation is represented by a quaternion and has four components (x, y, z, w). A quaternion is not as straight forward to use as a vector, and because of that the method *setEulerAngles* is used to change the rotation.

```javascript
teapot.position.y = -1;
teapot.scale.set(1.2);
teapot.rotationQuaternion.setEulerAngles(0, 15, 0);
```
*Moves the model to -1 on the y-axis. Rotates it to 15 degrees on the y-axis and scales it on all axes.*

### Lighting environment
Lights are needed to illuminate the objects in the scene, otherwise they may be rendered completely black (depending on the material being used). A lighting environment contains the different components used for lighting a scene. The lighting environment can be shared across objects, or each object can have it's own. The main lighting environment is created and used by default.

There are a few different types of lights available. The "point" type is a light that is located at a point and emits light in all directions equally. The "directional" type is a light that is located infinitely far away, and emits light in one direction only. The "spot" type is a light that is located at a point and emits light in a cone shape. Lights have a transform and can be attached to other objects.

```javascript
let dirLight = new PIXI3D.Light();
dirLight.type = "directional";
dirLight.intensity = 0.5;
dirLight.rotationQuaternion.setEulerAngles(45, 45, 0);
dirLight.position.set(-4, 7, -4);
PIXI3D.LightingEnvironment.main.lights.push(dirLight);

let pointLight = new PIXI3D.Light();
pointLight.type = "point";
pointLight.intensity = 10;
pointLight.position.set(1, 0, 3);
PIXI3D.LightingEnvironment.main.lights.push(pointLight);
```
*Adds a directional light and a point light to the main lighting environment. The teapot should now be illuminated by the light.*

### Changing the material
Each mesh contains a material, and the standard material is used by default. The standard material has several properties which can be used for changing the appearance of a mesh. It's also possible to create custom materials to achieve almost any visual effect.

```javascript
teapot.meshes.forEach((mesh) => {
  mesh.material.baseColor = PIXI3D.Color.fromHex("#ffefd5");
});
```
*Gives the model a different color by setting the material color of each mesh.*

### Playing animations
Models can contain animations which has been created in a 3D modeling tool. There are three different kinds of animations: skeletal, morphing and transformation. Skeletal animation is often used for animating characters, but it can also be used to animate anything else as well. Morphing is used to animate per-vertex, for example to create a waving flag or a face expression. Transformation animations are used for moving, rotating and scaling entire objects.

```javascript
setInterval(() => {
  teapot.animations.forEach((anim) => anim.play());
}, 1500);
```
*Starts playing all animations in the model every 1.5 seconds.*

### Casting shadows
To enable lights to cast shadows, a shadow casting light is required. It wraps a light and gives it the ability to cast shadows. It has multiple settings for controlling the quality of the shadow, for example the size of the shadow texture and the softness of the shadow. Directional and spot light types have support for casting shadows.

```javascript
let ground = app.stage.addChild(PIXI3D.Mesh3D.createPlane());
ground.y = -1;
ground.scale.set(10);
```
*Creates a ground plane to have something to cast the shadows on.*

The shadows must also be enabled (using the standard pipeline) for an object to both receive and cast shadows.

```javascript
let shadowCastingLight = new PIXI3D.ShadowCastingLight(app.renderer, dirLight, {
  shadowTextureSize: 512,
  quality: PIXI3D.ShadowQuality.medium
});
shadowCastingLight.softness = 1;
shadowCastingLight.shadowArea = 8;

let pipeline = app.renderer.plugins.pipeline;
pipeline.enableShadows(teapot, shadowCastingLight);
pipeline.enableShadows(ground, shadowCastingLight);
```
*Enables shadows to be casted and received for both the model and the ground.*

### 2D and 3D
Compositing 2D (PixiJS) and 3D (Pixi3D) containers is simple and can be combined in many ways. 2D containers can be added on top of 3D containers, and the other way around. Although the containers can be combined, the transforms used by 2D and 3D works differently from each other and are not compatible. The transforms won't be affected by each other, even if they have a parent-child relation.

To be able to convert 3D coordinates to 2D coordinates (or the other way around) the camera methods `screenToWorld` and `worldToScreen` can be used. 

Another way of combining 2D and 3D objects is to render a 3D object as a sprite using `CompositeSprite`. Thay way, the 3D object can easily be positioned in 2D space. This method also makes it possible to use regular PixiJS filters with 3D objects.

```javascript
let vignette = app.stage.addChild(
  PIXI.Sprite.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-sandbox/master/assets/vignette.png"
  )
);

app.ticker.add(() => {
  Object.assign(vignette, {
    width: app.renderer.width, height: app.renderer.height
  });
});
```
*Adds a 2D vignette layer on top of the 3D scene to give it a more cinematic effect. Resizes the vignette to the size of the renderer.*

### Controlling the camera
The camera is used for controlling from which position and direction the 3D scene is rendered, it has a position and rotation which is used for changing the view. Like any other object which has a transform, it can be attached to another object. The camera can also be directly controlled by using a mouse or trackpad. The main camera is created and used by default.

```javascript
let control = new PIXI3D.CameraOrbitControl(app.view)
```
*Gives the user orbit control over the main camera using mouse/trackpad. Hold left mouse button and drag to orbit, use scroll wheel to zoom in/out.*

## API
The API documentation is available at https://api.pixi3d.org

## Changelog
All notable changes to this project will be documented in the [changelog](CHANGELOG.md)

## Development
For developing new features or fixing bugs, use *serve/src/index.js* with `npm start`.

## Tests
Automatic tests can run both using Puppeteer (Headless Chrome) and on a specific device/browser. Run command `npm test` to execute tests using Puppeteer or start local web server with `npm run test:browser` and go to http://localhost:8080/. Before running tests, build using `npm run build`.

## Building
Build to *dist* folder with `npm run build`.