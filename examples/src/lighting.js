let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

let mesh = app.stage.addChild(PIXI3D.Mesh3D.createCube())
mesh.material.metallic = 0
mesh.rotationQuaternion.setEulerAngles(0, 30, 0)

// A light that is located at a point and emits light in all directions equally.
let pointLight = Object.assign(new PIXI3D.Light(), {
  x: 1.1, y: 0.2, z: 2.0, color: new PIXI3D.Color(1, 0, 0), intensity: 10, type: PIXI3D.LightType.point,
})

// Create a image based lighting object with solid color cubemaps for diffuse
// and specular. This will function as a "ambient" light which doesn't have any
// particular position. This will make the non lit surfaces a bit brighter.
let ibl = new PIXI3D.ImageBasedLighting(
  PIXI3D.Cubemap.fromColors(new PIXI3D.Color(0.1, 0.1, 0.1)),
  PIXI3D.Cubemap.fromColors(new PIXI3D.Color(0.1, 0.1, 0.1))
)

PIXI3D.LightingEnvironment.main = new PIXI3D.LightingEnvironment(app.renderer)

// Add the point light to the lighting environment.
PIXI3D.LightingEnvironment.main.lights.push(pointLight)

// A light that, which is located infinitely far away, and emits light in 
// one direction only.
let directionalLight = Object.assign(new PIXI3D.Light(), {
  x: 0.2, y: 0.8, z: 2.0, intensity: 1, type: PIXI3D.LightType.directional,
})

// A light that is located at a point and emits light in a cone shape.
let spotLight = Object.assign(new PIXI3D.Light(), {
  x: -0.7, y: 0.4, z: 2.0, color: new PIXI3D.Color(0, 0, 1), intensity: 20, outerConeAngle: 25, type: PIXI3D.LightType.spot,
})

let gui = new dat.GUI()
gui.add(mesh.material, "metallic", 0, 1)
gui.add(mesh.material, "roughness", 0, 1)

createDraggableLightElement("Point light", pointLight)
createDraggableLightElement("Directional light", directionalLight)
createDraggableLightElement("Spot light", spotLight)

function createDraggableLightElement(text, light) {
  let element = document.body.appendChild(document.createElement("div"))
  element.innerText = text
  element.className = "light"

  updateElementFromLight(light, element)
  setTimeout(() => {
    // Wait just a moment to make sure the element is ready.
    updateLightFromElement(light, element)
  }, 100)

  let dragging = false
  element.addEventListener("mousedown", () => {
    dragging = true

    // When a element is clicked only that light is used.
    PIXI3D.LightingEnvironment.main.lights = [light]
  })

  document.addEventListener("mouseup", () => {
    dragging = false
  })

  document.addEventListener("mousemove", (event) => {
    event.preventDefault()
    if (dragging) {
      let bounds = element.getBoundingClientRect();
      Object.assign(element.style, {
        left: `${bounds.x + event.movementX}px`, top: `${bounds.y + event.movementY}px`
      })
      updateLightFromElement(light, element)
    }
  })
}

function updateLightFromElement(light, element) {
  let bounds = element.getBoundingClientRect()

  // The distance from the camera where we want the light to be.
  let distance = 2

  let { vec3, quat, mat3, mat4 } = glMatrix

  // Transform screen position of the element to world coordinates and 
  // calculate the light direction (only needed for point and spot).
  let position = PIXI3D.Camera.main.screenToWorld(
    bounds.x, bounds.y, distance, light.position)

  let look = mat4.targetTo(mat4.create(), vec3.create(),
    vec3.fromValues(position.x, position.y, position.z), vec3.fromValues(0, 1, 0))
  look = mat3.fromMat4(mat3.create(), look)
  look = quat.fromMat3(quat.create(), look)

  light.rotationQuaternion.set(look[0], look[1], look[2], look[3])
}

function updateElementFromLight(light, element) {
  // Transform world coordinates of the light to screen position.
  let position = PIXI3D.Camera.main.worldToScreen(light.x, light.y, light.z)
  Object.assign(element.style, {
    top: `${Math.round(position.y)}px`, left: `${Math.round(position.x)}px`
  })
}