import { expect } from "chai"
import { getImageDataFromRender, getImageDataFromUrl } from "./test-utils"

describe("Punctual light", () => {
  it("should render correctly with directional light", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      let light = Object.assign(new PIXI3D.Light(), {
        intensity: 0.7,
        type: PIXI3D.LightType.directional,
        color: new PIXI3D.Color(1, 0, 0)
      })
      light.rotationQuaternion.setEulerAngles(0, 120, 0)
      lightingEnvironment.lights.push(light)
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      model.y = -0.8
      renderer.render(model)
    }, [
      "assets/teapot/teapot.gltf"
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/htklv.png"))
  })

  it("should render correctly with point light", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      let light = Object.assign(new PIXI3D.Light(), {
        intensity: 0.7,
        x: 1,
        y: 1,
        z: 2,
        type: PIXI3D.LightType.point,
        color: new PIXI3D.Color(0, 1, 0)
      })
      lightingEnvironment.lights.push(light)
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      model.y = -0.8
      renderer.render(model)
    }, [
      "assets/teapot/teapot.gltf"
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/mqhbn.png"))
  })

  it("should render correctly with spot light", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      let light = Object.assign(new PIXI3D.Light(), {
        intensity: 0.7,
        x: -1,
        y: 0,
        z: 2,
        type: PIXI3D.LightType.spot,
        color: new PIXI3D.Color(0, 0, 1)
      })
      light.rotationQuaternion.setEulerAngles(0, 120, 0)
      lightingEnvironment.lights.push(light)
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      model.y = -0.8
      renderer.render(model)
    }, [
      "assets/teapot/teapot.gltf"
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/snbvz.png"))
  })
})