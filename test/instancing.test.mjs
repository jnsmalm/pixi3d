import { expect } from "chai"

describe("Instancing", () => {

  it("should render correctly with different colors and transforms", async () => {
    let render = (renderer, resources) => {
      let container = new PIXI3D.Container3D()
      let model = container.addChild(PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf))
      model.meshes.forEach(mesh => {
        mesh.material.unlit = true
      })
      let props = [
        { x: -2.5, baseColor: new PIXI3D.Color(1, 0, 0), rotation: -100 },
        { x: +0.0, baseColor: new PIXI3D.Color(0, 1, 0), rotation: 40 },
        { x: +2.5, baseColor: new PIXI3D.Color(0, 0, 1), rotation: 0 }
      ]
      for (let i = 0; i < 3; i++) {
        let instance = container.addChild(model.createInstance())
        instance.x = props[i].x
        instance.y = -0.8
        instance.rotationQuaternion.setEulerAngles(0, props[i].rotation, 0)
        instance.scale.set(0.7)
        instance.meshes.forEach(mesh => {
          mesh.material.baseColor = props[i].baseColor
        })
      }
      renderer.render(container)
    }
    await expect(render).to.match("snapshots/ddwrr.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ]
    })
  })

  it("should render correctly when all invisible instances was destroyed", async () => {
    let render = (renderer, resources) => {
      let container = new PIXI3D.Container3D()
      let model = container.addChild(PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf))
      model.meshes.forEach(mesh => {
        mesh.material.unlit = true
      })
      let instance = container.addChild(model.createInstance())
      instance.meshes.forEach(mesh => {
        mesh.material.baseColor = new PIXI3D.Color(1, 0, 0)
      })
      instance.visible = false
      renderer.render(container)
      instance.destroy(true)
      renderer.render(container)
    }
    await expect(render).to.match("snapshots/fxsnc.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ]
    })
  })
})