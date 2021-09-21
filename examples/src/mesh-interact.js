let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

PIXI3D.LightingEnvironment.main.lights.push(Object.assign(new PIXI3D.Light(), {
  x: 0, y: 0, z: 3.0, color: new PIXI3D.Color(1, 1, 1), intensity: 15,
}))

class Interactable extends PIXI3D.Container3D {
  constructor(x, y, z, scale, eulerAngles, r, g, b) {
    super()

    this.mesh = this.addChild(PIXI3D.Mesh3D.createCube())
    this.mesh.material.baseColor = new PIXI3D.Color(r, g, b)
    this.mesh.scale.set(scale)
    this.mesh.rotationQuaternion.setEulerAngles(eulerAngles.x, eulerAngles.y, eulerAngles.z)
    this.mesh.position.set(x, y, z)

    // The picking hit area is set to enable picking interaction.
    this.mesh.hitArea = new PIXI3D.PickingHitArea(app.renderer, this.mesh)

    // To enable a mesh to be interacted with, "interactive" needs to be set. In 
    // this case "buttonMode" is also set to have the cursor changed to pointer.
    this.mesh.interactive = true
    this.mesh.buttonMode = true

    this.mesh.on("pointerup", () => { this.mesh.scale.set(scale) })
    this.mesh.on("pointerdown", () => { this.mesh.scale.set(scale * 1.2) })
    this.mesh.on("pointerout", () => { this.mesh.scale.set(scale) })
  }
}

app.stage.addChild(
  new Interactable(0.8, 0.3, 0.5, 0.5, { x: 50, y: 145, z: 45 }, 1, 0.5, 0))
app.stage.addChild(
  new Interactable(1, 1.8, 0, 0.6, { x: 0, y: 45, z: 45 }, 1, 0, 1))
app.stage.addChild(
  new Interactable(-1, 1.5, 0, 0.8, { x: 50, y: 125, z: 115 }, 1, 1, 0))
app.stage.addChild(
  new Interactable(0.8, -1.0, -1.0, 1.5, { x: 40, y: 45, z: 120 }, 0.5, 0.5, 1))
app.stage.addChild(
  new Interactable(-0.7, -1.0, 1.0, 0.4, { x: 240, y: 85, z: 20 }, 1, 0.5, 1))
