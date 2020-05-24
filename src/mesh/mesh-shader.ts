import * as PIXI from "pixi.js"

import { MeshGeometry } from "./mesh-geometry"
import { Mesh3D } from "./mesh"

export class MeshShader extends PIXI.Shader {

  /** Default state used to render a mesh. */
  state = Object.assign(new PIXI.State(), {
    culling: true, clockwiseFrontFace: false, depthTest: true
  })

  /** Default draw mode used to render a mesh. */
  drawMode = PIXI.DRAW_MODES.TRIANGLES

  get name() {
    return "mesh-shader"
  }

  /**
   * Adds the required geometry attributes used by this shader.
   * @param geometry Mesh geometry to use.
   */
  addShaderAttributes(geometry: MeshGeometry) {
    if (geometry.indices) {
      // PIXI seems to have problems using anything other than 
      // gl.UNSIGNED_SHORT or gl.UNSIGNED_INT. Let's convert to UNSIGNED_INT.
      geometry.addIndex(new PIXI.Buffer(new Uint32Array(geometry.indices.buffer)))
    }
    if (geometry.positions) {
      geometry.addAttribute("a_Position", new PIXI.Buffer(geometry.positions.buffer),
        3, false, PIXI.TYPES.FLOAT, geometry.positions.stride)
    }
    if (geometry.uvs && geometry.uvs[0]) {
      geometry.addAttribute("a_UV1", new PIXI.Buffer(geometry.uvs[0].buffer),
        2, false, PIXI.TYPES.FLOAT, geometry.uvs[0].stride)
    }
    if (geometry.normals) {
      geometry.addAttribute("a_Normal", new PIXI.Buffer(geometry.normals.buffer),
        3, false, PIXI.TYPES.FLOAT, geometry.normals.stride)
    }
    if (geometry.tangents) {
      geometry.addAttribute("a_Tangent", new PIXI.Buffer(geometry.tangents.buffer),
        4, false, PIXI.TYPES.FLOAT, geometry.tangents.stride)
    }
  }

  /**
   * Renders the geometry of the specified mesh.
   * @param mesh Mesh to render.
   * @param renderer Renderer to use.
   * @param state Rendering state to use.
   * @param drawMode Draw mode to use.
   */
  render(mesh: Mesh3D, renderer: PIXI.Renderer, state?: PIXI.State, drawMode?: PIXI.DRAW_MODES) {
    if (!mesh.geometry.hasShaderAttributes(this)) {
      mesh.geometry.addShaderAttributes(this)
    }
    renderer.shader.bind(this, false)
    renderer.state.set(state || this.state)
    renderer.geometry.bind(mesh.geometry, this)
    renderer.geometry.draw(drawMode || this.drawMode)
  }
}