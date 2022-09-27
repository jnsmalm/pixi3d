import { expect } from "chai"

describe("Punctual light", () => {

  it("should render correctly with directional light using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
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
    }
    await expect(render).to.match("snapshots/htklv.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ]
    })
  })

  it("should render correctly with point light using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
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
    }
    await expect(render).to.match("snapshots/mqhbn.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ]
    })
  })

  it("should render correctly with spot light using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
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
    }
    await expect(render).to.match("snapshots/snbvz.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ]
    })
  })
})