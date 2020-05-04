let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

app.loader.add("assets/shaders/color/color.vert")
app.loader.add("assets/shaders/color/color.frag")

app.loader.load(() => {
  // Create a cube mesh and add it to the stage. When creating the cube, a 
  // material factory can be given as an optional parameter. The material 
  // factory is responsible for creating the material used for rendering the mesh.
  let mesh = app.stage.addChild(PIXI3D.Mesh3D.createCube(ColorMaterial))

  let rotation = 0
  app.ticker.add(() => {
    mesh.rotationQuaternion.setEulerAngles(0, rotation++, 0)
  })

  let gui = new dat.GUI()
  gui.addColor(mesh.material, "color")
})

class ColorMaterial extends PIXI3D.Material {
  constructor() {
    super()

    // The default color is white using RGB (0-255).
    this.color = [255, 255, 255]
  }

  updateUniforms(mesh, shader) {
    // Updates the shader uniforms before rendering with this material.
    shader.uniforms.u_World = mesh.worldTransform.toArray()
    shader.uniforms.u_ViewProjection = PIXI3D.Camera3D.main.viewProjection
    shader.uniforms.u_Color = this.color.map(c => c / 255)
  }

  static create() {
    return new ColorMaterial()
  }

  createShader() {
    // Create the shader used when rendering with this material. In this case
    // just take the shader source which was loaded from file.
    let program = PIXI.Program.from(
      app.loader.resources["assets/shaders/color/color.vert"].source,
      app.loader.resources["assets/shaders/color/color.frag"].source)
    return new PIXI.Shader(program)
  }
}