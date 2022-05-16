import { expect } from "chai"
import { getImageDataFromRender, getImageDataFromUrl } from "./test-utils"

describe("Camera orbit control", () => {
  it("should render correctly with angles and distance", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      let light = Object.assign(new PIXI3D.Light(), {
        intensity: 1.7,
        type: PIXI3D.LightType.directional,
        color: new PIXI3D.Color(1, 0, 0)
      })
      light.rotationQuaternion.setEulerAngles(0, 50, 0)
      lightingEnvironment.lights.push(light)

      let control = new PIXI3D.CameraOrbitControl(renderer.view)
      control.angles.x = 45
      control.angles.y = 0
      control.distance = 10
      control.updateCamera()
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      renderer.render(model)
    }, [
      "assets/teapot/teapot.gltf",
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/dopot.png"))
  })
  it("should render correctly with target", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      let light = Object.assign(new PIXI3D.Light(), {
        intensity: 1.7,
        type: PIXI3D.LightType.directional,
        color: new PIXI3D.Color(1, 1, 0)
      })
      light.rotationQuaternion.setEulerAngles(0, 50, 0)
      lightingEnvironment.lights.push(light)

      let control = new PIXI3D.CameraOrbitControl(renderer.view)
      control.target = { x: -1, y: 3, z: 0 }
      control.updateCamera()
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      renderer.render(model)
    }, [
      "assets/teapot/teapot.gltf",
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/eqgul.png"))
  })
})