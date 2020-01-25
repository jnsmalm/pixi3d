const { Model3D, Mesh3D, Container3D, Camera3D } = PIXI3D

let app = new PIXI.Application({
  antialias: true, backgroundColor: 0x888888, resizeTo: window
})

app.loader.load(() => {
  //
})

document.body.appendChild(app.view)