import { expect } from "chai"

describe("Shadow", () => {

  it("should render correctly with directional light using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let container = new PIXI3D.Container3D()
      container.y = -0.8

      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      let light = Object.assign(new PIXI3D.Light(), {
        intensity: 0.7,
        type: PIXI3D.LightType.directional
      })
      light.rotationQuaternion.setEulerAngles(25, 120, 0)
      lightingEnvironment.lights.push(light)

      let model = container.addChild(PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf))
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      let ground = container.addChild(PIXI3D.Mesh3D.createPlane())
      ground.scale.set(10, 1, 10)
      ground.material.lightingEnvironment = lightingEnvironment

      let shadowCastingLight = new PIXI3D.ShadowCastingLight(
        renderer, light, { shadowTextureSize: 1024, quality: PIXI3D.ShadowQuality.medium })
      shadowCastingLight.softness = 1
      shadowCastingLight.shadowArea = 15

      let pipeline = renderer.plugins.pipeline
      pipeline.enableShadows(model, shadowCastingLight)
      pipeline.enableShadows(ground, shadowCastingLight)

      renderer.render(container)
    }
    await expect(render).to.match("snapshots/zjehs.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ],
      maxDiff: 200
    })
  })

  it("should render correctly with spot light using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let container = new PIXI3D.Container3D()
      container.y = -0.8

      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      let light = Object.assign(new PIXI3D.Light(), {
        intensity: 1.7,
        x: 2,
        y: 1,
        z: 2,
        type: PIXI3D.LightType.spot
      })
      light.rotationQuaternion.setEulerAngles(25, -120, 0)
      lightingEnvironment.lights.push(light)

      let model = container.addChild(PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf))
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      let ground = container.addChild(PIXI3D.Mesh3D.createPlane())
      ground.scale.set(10, 1, 10)
      ground.material.lightingEnvironment = lightingEnvironment

      let shadowCastingLight = new PIXI3D.ShadowCastingLight(
        renderer, light, { shadowTextureSize: 1024, quality: PIXI3D.ShadowQuality.medium })
      shadowCastingLight.softness = 1
      shadowCastingLight.shadowArea = 15

      let pipeline = renderer.plugins.pipeline
      pipeline.enableShadows(model, shadowCastingLight)
      pipeline.enableShadows(ground, shadowCastingLight)

      renderer.render(container)
    }
    await expect(render).to.match("snapshots/hdstj.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ]
    })
  })
})