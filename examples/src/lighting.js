let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})

document.body.appendChild(app.view)

let mesh = app.stage.addChild(PIXI3D.Mesh3D.createCube())
mesh.rotationQuaternion.setEulerAngles(0, 30, 0)

// A light that is located at a point and emits light in all directions equally.
let pointLight = Object.assign(new PIXI3D.Light(), {
  color: [1, 0, 0],
  intensity: 40,
  x: 1.1, y: 0.2, z: 2.0,
  type: PIXI3D.LightType.point,
})

// Add the point light to the lighting environment.
PIXI3D.LightingEnvironment.main.lights.push(pointLight)

// A light that, which is located infinitely far away, and emits light in 
// one direction only.
let directionalLight = Object.assign(new PIXI3D.Light(), {
  x: 0.2, y: 0.8, z: 2.0,
  type: PIXI3D.LightType.directional,
})

// A light that is located at a point and emits light in a cone shape.
let spotLight = Object.assign(new PIXI3D.Light(), {
  outerConeAngle: Math.PI / 8,
  color: [0, 0, 1],
  intensity: 30,
  x: -0.7, y: 0.4, z: 2.0,
  type: PIXI3D.LightType.spot,
})

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

  // Transform screen position of the element to world coordinates and 
  // calculate the light direction (only needed for point and spot).
  let position = PIXI3D.Camera3D.main.screenToWorld(bounds.x, bounds.y, distance)
  let direction = glMatrix.vec3.subtract(glMatrix.vec3.create(),
    glMatrix.vec3.create(), glMatrix.vec3.set(
      glMatrix.vec3.create(), position.x, position.y, position.z))

  light.position.set(position.x, position.y, position.z)
  light.direction = glMatrix.vec3.normalize(direction, direction)
}

function updateElementFromLight(light, element) {
  // Transform world coordinates of the light to screen position.
  let position = PIXI3D.Camera3D.main.worldToScreen(light.x, light.y, light.z)
  Object.assign(element.style, {
    top: `${Math.round(position.y)}px`, left: `${Math.round(position.x)}px`
  })
}