import { expect } from "chai"

describe("Standard material", () => {

  it("should render correctly with ibl (version 1, ldr) and no textures using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      lightingEnvironment.imageBasedLighting = new PIXI3D.ImageBasedLighting(
        resources["assets/chromatic/diffuse.cubemap"].cubemap,
        resources["assets/chromatic/specular.cubemap"].cubemap
      )
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.y = -0.8
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      renderer.render(model)
    }
    await expect(render).to.match("snapshots/acfkf.png", {
      resources: [
        "assets/teapot/teapot.gltf",
        "assets/chromatic/specular.cubemap",
        "assets/chromatic/diffuse.cubemap"
      ]
    })
  })

  it("should render correctly with ibl (version 2, rgbe8) and no textures using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      lightingEnvironment.imageBasedLighting = new PIXI3D.ImageBasedLighting(
        resources["assets/sunset/diffuse.cubemap"].cubemap,
        resources["assets/sunset/specular.cubemap"].cubemap
      )
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.y = -0.8
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      renderer.render(model)
    }
    await expect(render).to.match("snapshots/msohy.png", {
      resources: [
        "assets/teapot/teapot.gltf",
        "assets/sunset/specular.cubemap",
        "assets/sunset/diffuse.cubemap"
      ]
    })
  })

  it("should render transparency correctly using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      lightingEnvironment.imageBasedLighting = new PIXI3D.ImageBasedLighting(
        resources["assets/chromatic/diffuse.cubemap"].cubemap,
        resources["assets/chromatic/specular.cubemap"].cubemap
      )
      let container = new PIXI3D.Container3D()
      let model = container.addChild(PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf))
      model.y = -0.8
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      let transparent = container.addChild(PIXI3D.Mesh3D.createQuad())
      transparent.z = 1.5
      transparent.material.baseColor = new PIXI3D.Color(1, 0, 1)
      transparent.material.unlit = true
      transparent.alpha = 0.5
      renderer.render(container)
    }
    await expect(render).to.match("snapshots/odqxx.png", {
      resources: [
        "assets/teapot/teapot.gltf",
        "assets/chromatic/specular.cubemap",
        "assets/chromatic/diffuse.cubemap"
      ]
    })
  })

  it("should render correctly with 3 vertex colors using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/cherry/cherry-color3.gltf"].gltf)
      model.scale.set(0.25)
      model.position.set(-2, -2, 0)
      model.meshes.forEach(mesh => {
        mesh.material.unlit = true
        mesh.material.baseColor = new PIXI3D.Color(1, 0.8, 0.8)
      })
      renderer.render(model)
    }
    await expect(render).to.match("snapshots/clhhg.png", {
      resources: [
        "assets/cherry/cherry-color3.gltf"
      ]
    })
  })

  it("should render correctly with 4 vertex colors using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/cherry/cherry-color4.gltf"].gltf)
      model.scale.set(0.25)
      model.position.set(-2, -2, 0)
      model.meshes.forEach(mesh => {
        mesh.material.unlit = true
        mesh.material.baseColor = new PIXI3D.Color(0.8, 0.8, 1)
      })
      renderer.render(model)
    }
    await expect(render).to.match("snapshots/nldsg.png", {
      resources: [
        "assets/cherry/cherry-color4.gltf"
      ]
    })
  })

  it("should render correctly with fog using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      lightingEnvironment.imageBasedLighting = new PIXI3D.ImageBasedLighting(
        resources["assets/sunset/diffuse.cubemap"].cubemap,
        resources["assets/sunset/specular.cubemap"].cubemap
      )
      lightingEnvironment.fog = new PIXI3D.Fog(1, 3.5, PIXI3D.Color.fromHex(0xcccccc))
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.y = -0.8
      model.z = 2
      model.rotationQuaternion.setEulerAngles(0, -55, 0)
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      renderer.render(model)
    }
    await expect(render).to.match("snapshots/yahtk.png", {
      resources: [
        "assets/teapot/teapot.gltf",
        "assets/sunset/specular.cubemap",
        "assets/sunset/diffuse.cubemap"
      ]
    })
  })

})