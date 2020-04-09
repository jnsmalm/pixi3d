let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

let mesh = app.stage.addChild(PIXI3D.Mesh3D.createCube())

// To enable a mesh to be picked, interactive needs to be set. In this case the
// buttonMode is also set to have the cursor changed to pointer.
mesh.interactive = true
mesh.buttonMode = true

mesh.on("mouseup", () => { mesh.scale.set(1.0) })
mesh.on("mousedown", () => { mesh.scale.set(1.1) })
mesh.on("mouseout", () => { mesh.scale.set(1.0) })

let rotation = 0
app.ticker.add(() => {
  mesh.rotationQuaternion.setEulerAngles(0, rotation++, 0)
})
