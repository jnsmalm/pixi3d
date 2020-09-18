# Pixi3D
Pixi3D is a JavaScript library which makes it easy to render 3D graphics on the web. It works for both desktop and mobile web browsers and includes several components which makes it easy to create nice looking 3D scenes out-of-the-box:

* Load models from file or create procedural generated meshes
* Physically-based rendering (PBR) and image-based lighting (IBL)
* Dynamic shadows
* Transformation, morphing and skeletal animations
* Customized materials and shaders
* Built on top of the widely used PixiJS library which makes it simple to combine 2D and 3D

## Getting started
Let's create a simple application which renders a rotating cube. Start by [getting the latest version of Pixi3D](https://github.com/jnsmalm/pixi3d/releases). Also [get an up-to-date version of PixiJS](https://github.com/pixijs/pixi.js/releases) (v5.3+) which is needed to use Pixi3D.

Next, create a file *app.js* with the following contents.

```javascript
let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

let mesh = app.stage.addChild(PIXI3D.Mesh3D.createCube())

PIXI3D.LightingEnvironment.main.lights.push(
  Object.assign(new PIXI3D.Light(), { x: -1, z: 3 }))

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

### Install with npm
Pixi3D is also available as a npm package, to install the latest release you can run the following command:

`npm install pixi3d --save-dev`

This requires that an up-to-date version of Node.js is already installed.

### Examples
The source code includes a collection of examples which shows how to use some of the different features of Pixi3D. To be able to run the examples, download or clone the repository from https://github.com/jnsmalm/pixi3d and run *npm install*. Browse the examples inside the *examples/src* folder and run them using the *serve* script. For example, to run the *getting-started* application:

`npm run serve -- --env.example=getting-started`

The *serve* script can also be used for trying out Pixi3D without having to do any additional setup. Just create a new file i.e. *testing-feature.js* in the examples folder and run it with the *serve* script:

`npm run serve -- --env.example=testing-feature`

## Quick guide
The overall goal of Pixi3D is to make it easy to render 3D graphics on the web. It's built on top of PixiJS, which is at it's core, an established 2D rendering library. Even though Pixi3D targets developers already familiar and productive using PixiJS, it's easy to get started without any previous knowledge of PixiJS. PixiJS contains many features which makes it easier to create interactive graphic intense applications. For example: loading assets, managing a scene graph or handling user interaction. Because Pixi3D is built on top of PixiJS, all of those features are available in Pixi3D as well. Learn more about PixiJS at https://www.pixijs.com

Go to https://pixi3d.org/demo/drone/ to view a real-time demo of the scene created with this guide. The source code is available at [examples/src/quick-guide.js](examples/src/quick-guide.js) and assets used can be found in the examples/assets folder.

### Creating an application
The quickest way to get started is by creating an PixiJS application object. The application object creates a renderer and automatically starts the render loop. It also creates a canvas element which should be added to the HTML document.

```javascript
let app = new PIXI.Application({
  backgroundColor: 0x555555, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)
```
*Creates an application and adds the canvas element which results in an empty 
page with a dark-grey background.*

### Loading a 3D model
A model includes a hierarchy of 3D objects which are called meshes. A mesh contains the geometry and material used for rendering that object. Models are generally being loaded from a file which has been created in a 3D modeling tool like Maya or Blender. Pixi3D supports loading of models using the glTF 2.0 file format. 

> glTF™ (GL Transmission Format) is a royalty-free specification for the efficient transmission and loading of 3D scenes and models by applications. glTF minimizes both the size of 3D assets, and the runtime processing needed to unpack and use those assets. glTF defines an extensible, common publishing format for 3D content tools and services that streamlines authoring workflows and enables interoperable use of content across the industry.

Learn more about glTF at https://www.khronos.org/gltf/

For testing purposes and to get started more quickly, glTF 2.0 sample models can be found at https://github.com/KhronosGroup/glTF-Sample-Models. The specific model used in this guide was downloaded from [Sketchfab](https://skfb.ly/TBnX). License: [Creative Commons Attribution-NonCommercial](https://creativecommons.org/licenses/by-nc/4.0/)

```javascript
app.loader.add("assets/buster_drone/scene.gltf")

app.loader.load((loader, resources) => {
  let model = app.stage.addChild(
    PIXI3D.Model.from(resources["assets/buster_drone/scene.gltf"].gltf))
})
```
*Loads a glTF 2.0 file and creates a model. The silhouette of a drone should appear. For now, it will be rendered black because there is no lighting.*

### Position, rotation and scale
All objects in a scene have a transform which is used for setting the position, rotation and scale of that object. The transform of an object is always relative to it's parent transform. So when changing the transform of the parent object, all of it's childrens transforms will be affected as well.

Both position and scale is represented by a vector with three components (x, y, z), one for each axis. Rotation is represented by a quaternion and has four components (x, y, z, w). A quaternion is not as straight forward to use as a vector, because of that there is a method *setEulerAngles* used for changing the rotation.

```javascript
model.position.y = 0.3
model.scale.set(2)
model.rotationQuaternion.setEulerAngles(0, 25, 0)
```
*Moves the model to 0.3 on the y-axis. Rotates it to 25 degrees on the y-axis and scales it on all axes.*

### Lighting environment
Lights are needed to illuminate the objects in the scene, otherwise they may be rendered completely black (depending on the material being used). A lighting environment contains the different components used for lighting a scene. The lighting environment can be shared across objects, or each object can have it's own. The main lighting environment is created and used by default.

There are two different kinds of lights which can be used, and punctual lights is one of them. There are a few types of punctual lights available. The "point" type is a light that is located at a point and emits light in all directions equally. The "directional" type is a light that is located infinitely far away, and emits light in one direction only. The "spot" type is a light that is located at a point and emits light in a cone shape. Lights have a transform and can be attached to other objects.

```javascript
let dirLight = Object.assign(new PIXI3D.Light(), {
  type: "directional", intensity: 0.5, x: -4, y: 7, z: -4
})
dirLight.rotationQuaternion.setEulerAngles(45, 45, 0)
PIXI3D.LightingEnvironment.main.lights.push(dirLight)

let pointLight = Object.assign(new PIXI3D.Light(), { 
  type: "point", x: -1, y: 0, z: 3, range: 10, intensity: 10
})
PIXI3D.LightingEnvironment.main.lights.push(pointLight)
```
*Adds a directional light and a point light to the main lighting environment. The drone should now be illuminated by the light.*

### Playing animations
Models can contain animations which has been created in a 3D modeling tool. There are three different kinds of animations: skeletal, morphing and transformation. Skeletal animation is often used for animating characters, but it can also be used to animate anything else as well. Morphing is used to animate per-vertex, for example to create a waving flag. Transformation animations are used for moving, rotating and scaling entire objects.

```javascript
model.animations[0].play()
```
*Starts playing the first animation in the model.*

### Casting shadows
To enable lights to cast shadows, there are two different components needed. First is a shadow casting light, which wraps the normal light and gives it the ability to cast shadows. It has multiple settings for controlling the quality of the shadow, for example the size of the shadow texture and the softness of the shadow. Both directional and spot light types have support for casting shadows.

The second component needed, is the shadow render pass, which renders shadows using the shadow casting light. Finally, shadows must be enabled for an object to both receive and cast shadows.

```javascript
let shadowCastingLight = new PIXI3D.ShadowCastingLight(
  app.renderer, dirLight, 512, 15, 1, PIXI3D.ShadowQuality.medium)

let shadowPass = PIXI3D.ShadowRenderPass.addAsRenderPass(app.renderer)
shadowPass.lights.push(shadowCastingLight)
shadowPass.enableShadows(model, shadowCastingLight)
```
*Creates a shadow casting light. Also creates the shadow render pass, adds the casting light and enables shadows for the drone model.*

### 2D and 3D
Compositing 2D (PixiJS) and 3D (Pixi3D) containers is simple and can be combined in many ways. 2D containers can be added on top of 3D containers, and the other way around. Although the containers can be combined, the transforms used by 2D and 3D works differently from each other and are not compatible. The transforms won't be affected by each other, even if they have a parent-child relation.

To be able to convert 3D coordinates to 2D coordinates (or the other way around) the camera methods *screenToWorld* and *worldToScreen* can be used.

```javascript
let vignette = app.stage.addChild(
  new PIXI.Sprite(PIXI.Texture.from("assets/vignette.png")))

app.ticker.add(() => {
  Object.assign(vignette, {
    width: app.renderer.width, height: app.renderer.height
  })
})
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

## Building
Build *pixi3d.js* to *dist* folder with production settings.
```
> npm run build
```