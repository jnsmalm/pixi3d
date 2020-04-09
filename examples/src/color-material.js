let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

app.loader.add("vert", "assets/shaders/color/color.vert")
app.loader.add("frag", "assets/shaders/color/color.frag")

app.loader.load(() => {
  // Create a cube mesh and add it to the stage. When creating the cube it
  // needs a material factory. The material factory is responsible for creating 
  // the material used when rendering the mesh.
  let mesh = app.stage.addChild(PIXI3D.Mesh3D.createCube(ColorMaterial))

  let rotation = 0
  app.ticker.add(() => {
    // When rotating an object in 3D, the "rotationQuaternion" is used instead
    // of the regular "rotation".
    mesh.rotationQuaternion.setEulerAngles(0, rotation++, 0)
  })

  let gui = new dat.GUI()
  gui.addColor(mesh.material, "color")
})

class ColorMaterial extends PIXI3D.Material {
  constructor() {
    // When creating a material, it can be initialized with the vertex shader 
    // attributes. This will make sure the geometry data sent to the shader is
    // in correct format. If more control is needed about how the geometry data
    // is structured, the "createGeometry" method can be overridden.
    super(["position"])

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
    // Creates the shader used when rendering with this material. In this case
    // just take the shader source which was loaded from file.
    let program = PIXI.Program.from(app.loader.resources["vert"].source,
      app.loader.resources["frag"].source)
    return new PIXI.Shader(program)
  }
}