import { expect } from "chai"

describe("Picking interaction", () => {

  it("should hit test for mesh using pixi 5.*.* and pixi 6.*.*", async () => {
    let renderer = new PIXI.Renderer()
    let mesh = PIXI3D.Mesh3D.createCube()
    mesh.hitArea = PIXI3D.PickingHitArea.fromObject(mesh)
    mesh.interactive = true
    renderer.render(mesh)
    let point = new PIXI.Point(renderer.width / 2, renderer.height / 2)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // A bit hacky to get the automatic test to work, this is not needed in
        // a real world scenario where actual events happens.
        renderer.plugins.picking._map.update([mesh.hitArea])
        renderer.plugins.picking._map.update([mesh.hitArea])

        expect(renderer.plugins.interaction.hitTest(point))
          .to.equal(mesh)
        resolve()
        renderer.destroy()
      })
    })
  })

  it("should not hit test for mesh using pixi 5.*.* and pixi 6.*.*", async () => {
    let renderer = new PIXI.Renderer()
    let mesh = PIXI3D.Mesh3D.createCube()
    mesh.hitArea = PIXI3D.PickingHitArea.fromObject(mesh)
    mesh.interactive = true
    renderer.render(mesh)
    let point = new PIXI.Point(100, 100)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // A bit hacky to get the automatic test to work, this is not needed in
        // a real world scenario where actual events happens.
        renderer.plugins.picking._map.update([mesh.hitArea])
        renderer.plugins.picking._map.update([mesh.hitArea])

        expect(renderer.plugins.interaction.hitTest(point)).to.be.null
        resolve()
        renderer.destroy()
      })
    })
  })

  it("should hit test for mesh using pixi 7.*.*", async () => {
    let renderer = new PIXI.Renderer()
    let mesh = PIXI3D.Mesh3D.createCube()
    mesh.hitArea = PIXI3D.PickingHitArea.fromObject(mesh)
    mesh.interactive = true
    renderer.render(mesh)
    let point = new PIXI.Point(renderer.width / 2, renderer.height / 2)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // A bit hacky to get the automatic test to work, this is not needed in
        // a real world scenario where actual events happens.
        renderer.plugins.picking._map.update([mesh.hitArea])
        renderer.plugins.picking._map.update([mesh.hitArea])

        const boundary = new PIXI.EventBoundary(mesh)
        expect(boundary.hitTest(point.x, point.y)).to.equal(mesh)
        resolve()
        renderer.destroy()
      })
    })
  })

  it("should not hit test for mesh using pixi 7.*.*", async () => {
    let renderer = new PIXI.Renderer()
    let mesh = PIXI3D.Mesh3D.createCube()
    mesh.hitArea = PIXI3D.PickingHitArea.fromObject(mesh)
    mesh.interactive = true
    renderer.render(mesh)
    let point = new PIXI.Point(100, 100)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // A bit hacky to get the automatic test to work, this is not needed in
        // a real world scenario where actual events happens.
        renderer.plugins.picking._map.update([mesh.hitArea])
        renderer.plugins.picking._map.update([mesh.hitArea])

        const boundary = new PIXI.EventBoundary(mesh)
        expect(boundary.hitTest(point.x, point.y)).to.be.null
        resolve()
        renderer.destroy()
      })
    })
  })
})