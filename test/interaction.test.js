import { expect } from "chai"

describe("Picking interaction", () => {
  it("should hit test for mesh", async () => {
    let renderer = new PIXI.Renderer()
    let mesh = PIXI3D.Mesh3D.createCube()
    mesh.hitArea = PIXI3D.PickingHitArea.fromObject(mesh)
    mesh.interactive = true
    renderer.render(mesh)
    let point = new PIXI.Point(renderer.width / 2, renderer.height / 2)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        expect(mesh).to.equal(
          renderer.plugins.interaction.hitTest(point))
        resolve()
        renderer.destroy()
      }, 200)
    })
  })
  
  it("should not hit test for mesh", async () => {
    let renderer = new PIXI.Renderer()
    let mesh = PIXI3D.Mesh3D.createCube()
    mesh.hitArea = PIXI3D.PickingHitArea.fromObject(mesh)
    mesh.interactive = true
    renderer.render(mesh)
    let point = new PIXI.Point(100, 100)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        expect(renderer.plugins.interaction.hitTest(point)).to.be.null
        resolve()
        renderer.destroy()
      }, 200)
    })
  })
})