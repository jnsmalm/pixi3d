import * as PIXI from "pixi.js"

import { PlaneGeometry } from "./geometry/plane-geometry"
import { CubeGeometry } from "./geometry/cube-geometry"
import { MeshGeometry3D } from "./geometry/mesh-geometry"
import { Material } from "../material/material"
import { StandardMaterial } from "../material/standard/standard-material"
import { Container3D } from "../container"
import { QuadGeometry } from "./geometry/quad-geometry"
import { Skin } from "../skinning/skin"

/**
 * Represents a mesh which contains geometry and has a material.
 */
export class Mesh3D extends Container3D {

  /** The name of the plugin used for rendering the mesh. */
  pluginName = "mesh3d"

  /** Array of weights used for morphing between geometry targets. */
  morphWeights?: number[]

  /** The skin used for vertex skinning. */
  skin?: Skin

  /** Names of the passes used for rendering the mesh. */
  renderPasses = ["standard"]

  /**
   * Creates a new mesh with the specified geometry and material.
   * @param geometry The geometry for the mesh.
   * @param material The material for the mesh. If the material is empty the mesh won't be rendered.
   */
  constructor(public geometry: MeshGeometry3D, public material?: Material) {
    super()
    if (!geometry) {
      throw new Error("PIXI3D: Geometry is required when creating a mesh.")
    }
  }

  _render(renderer: PIXI.Renderer) {
    renderer.batch.setObjectRenderer(
      <PIXI.ObjectRenderer>(<any>renderer.plugins)[this.pluginName]
    );
    <PIXI.ObjectRenderer>(<any>renderer.plugins)[this.pluginName].render(this)
  }

  /**
   * Creates a new quad (flat square) mesh with the specified material.
   * @param material The material to use.
   */
  static createQuad(material: Material = new StandardMaterial()) {
    return new Mesh3D(QuadGeometry.create(), material)
  }

  /**
   * Creates a new cube (six faces) mesh with the specified material.
   * @param material The material to use.
   */
  static createCube(material: Material = new StandardMaterial()) {
    return new Mesh3D(CubeGeometry.create(), material)
  }

  /**
   * Creates a new plane (flat square) mesh with the specified material.
   * @param material The material to use.
   */
  static createPlane(material: Material = new StandardMaterial()) {
    return new Mesh3D(PlaneGeometry.create(), material)
  }
}