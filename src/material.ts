import { MeshGeometryData } from "./mesh/mesh-geometry"
import { Mesh3D } from "./mesh/mesh"

/**
 * Predefined attributes for material shader.
 */
export enum MaterialShaderAttribute {
  /** Expects shader attribute to be "attribute vec3 a_Position". */
  position = "position",
  /** Expects shader attribute to be "attribute vec2 a_UV1". */
  uv1 = "uv1",
  /** Expects shader attribute to be "attribute vec3 a_Normal". */
  normal = "normal",
  /** Expects shader attribute to be "attribute vec4 a_Tangent". */
  tangent = "tangent"
}

/**
 * Factory for creating materials.
 */
export interface MaterialFactory {
  /** Creates a new material from the specified source. */
  create(source: unknown): Material
}

/**
 * Materials are used to render a single mesh.
 */
export abstract class Material {
  protected _geometry?: PIXI.Geometry
  protected _mesh?: Mesh3D
  protected _shader?: PIXI.Shader

  /** State used to render a mesh. */
  state = Object.assign(new PIXI.State(), {
    culling: true, clockwiseFrontFace: false, depthTest: true
  })

  /** Value indicating if the material is valid to render. */
  get valid() {
    return true
  }

  /** Draw mode used to render a mesh. */
  drawMode = PIXI.DRAW_MODES.TRIANGLES

  /** Value indicating if the material is transparent. */
  transparent = false

  /**
   * Creates a new material.
   * @param attributes Predefined attributes for the shader.
   */
  constructor(public attributes: MaterialShaderAttribute[] = []) { }

  /**
   * Creates a shader used to render a mesh.
   * @param mesh Mesh to use.
   * @param renderer Renderer to use.
   */
  abstract createShader(mesh: Mesh3D, renderer: any): PIXI.Shader

  /**
   * Updates the uniforms for the specified shader.
   * @param mesh Mesh to use.
   * @param shader Shader for updating uniforms.
   */
  abstract updateUniforms?(mesh: Mesh3D, shader: PIXI.Shader): void

  /**
   * Creates geometry used to render a mesh. Will use the predefined shader 
   * attributes if those have been set.
   * @param data Data used for creating the geometry.
   */
  createGeometry(data: MeshGeometryData): PIXI.Geometry {
    let geometry = new PIXI.Geometry()
    if (data.indices) {
      // PIXI seems to have problems using anything other than 
      // gl.UNSIGNED_SHORT or gl.UNSIGNED_INT. Let's convert to UNSIGNED_INT.
      geometry.addIndex(new PIXI.Buffer(new Uint32Array(data.indices.buffer)))
    }
    if (this.attributes.includes(MaterialShaderAttribute.position)) {
      if (data.positions) {
        let buffer = new PIXI.Buffer(data.positions.buffer)
        geometry.addAttribute("a_Position", buffer, 3, false, PIXI.TYPES.FLOAT, data.positions.stride)
      }
    }
    if (this.attributes.includes(MaterialShaderAttribute.uv1)) {
      if (data.texCoords) {
        let buffer = new PIXI.Buffer(data.texCoords.buffer)
        geometry.addAttribute("a_UV1", buffer, 2, false, PIXI.TYPES.FLOAT, data.texCoords.stride)
      }
    }
    if (this.attributes.includes(MaterialShaderAttribute.normal)) {
      if (data.normals) {
        let buffer = new PIXI.Buffer(data.normals.buffer)
        geometry.addAttribute("a_Normal", buffer, 3, false, PIXI.TYPES.FLOAT, data.normals.stride)
      }
    }
    if (this.attributes.includes(MaterialShaderAttribute.tangent)) {
      if (data.tangents) {
        let buffer = new PIXI.Buffer(data.tangents.buffer)
        geometry.addAttribute("a_Tangent", buffer, 4, false, PIXI.TYPES.FLOAT, data.tangents.stride)
      }
    }
    return geometry
  }

  /**
   * Renders the specified mesh.
   * @param mesh Mesh to render.
   * @param renderer Renderer to use.
   */
  render(mesh: Mesh3D, renderer: any) {
    if (this._mesh && mesh !== this._mesh) {
      throw new Error("PIXI3D: Material can't be shared between meshes.")
    } else {
      this._mesh = mesh
    }
    if (!this.valid) {
      return
    }
    if (!this._shader) {
      this._shader = this.createShader(mesh, renderer)
    }
    if (!this._geometry) {
      this._geometry = this.createGeometry(mesh.geometry)
    }
    if (this.updateUniforms) {
      this.updateUniforms(mesh, this._shader)
    }
    renderer.shader.bind(this._shader)
    renderer.state.set(this.state)
    renderer.geometry.bind(this._geometry, this._shader)
    renderer.geometry.draw(this.drawMode)
  }
}