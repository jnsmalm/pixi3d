let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

app.loader.add("assets/shaders/mesh-geometry/mesh-geometry.vert")
app.loader.add("assets/shaders/mesh-geometry/mesh-geometry.frag")

app.loader.load(() => {
  // Create the geometry needed to render the mesh with the specified material. 
  // In this case, the vertex data includes position (x,y,z) and color (r,g,b). 
  // Three vertices is needed to get the triangle shape.
  let geometry = Object.assign(new PIXI3D.MeshGeometry3D(), {
    positions: {
      buffer: new Float32Array([
        // Vertex 1 (x,y,z)
        -3, -2, 0,
        // Vertex 2 (x,y,z)
        +3, -2, 0,
        // Vertex 3 (x,y,z)
        +0, +2, 0
      ])
    },
    colors: {
      buffer: new Float32Array([
        // Vertex 1 (r,g,b)
        0, 0, 1,
        // Vertex 2 (r,g,b)
        0, 1, 0,
        // Vertex 3 (r,g,b)
        1, 0, 0
      ])
    }
  })
  app.stage.addChild(
    new PIXI3D.Mesh3D(geometry, new MeshGeometryMaterial()))
})

class MeshGeometryMaterial extends PIXI3D.Material {
  updateUniforms(mesh, shader) {
    // Updates the shader uniforms before rendering with this material.
    shader.uniforms.u_World = mesh.worldTransform.toArray()
    shader.uniforms.u_ViewProjection = PIXI3D.Camera3D.main.viewProjection
  }

  createShader() {
    // Create the shader used when rendering with this material. In this case
    // just take the shader source which was loaded from file.
    let program = PIXI.Program.from(
      app.loader.resources["assets/shaders/mesh-geometry/mesh-geometry.vert"].source,
      app.loader.resources["assets/shaders/mesh-geometry/mesh-geometry.frag"].source)
    return new ColorShader(program)
  }
}

class ColorShader extends PIXI3D.MeshShader {
  addGeometryAttributes(geometry) {
    // Add the attributes used when rendering with the specified shader. This
    // geometry has two attributes: position and color. The number of components
    // for the attribute is also specified, both have three (z,y,z and r,g,b).
    geometry.addAttribute("a_Position", geometry.positions.buffer, 3)
    geometry.addAttribute("a_Color", geometry.colors.buffer, 3)
  }
}