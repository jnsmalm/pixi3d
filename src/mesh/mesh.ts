import { Renderer, ObjectRenderer } from "@pixi/core"
import { PlaneGeometry } from "./geometry/plane-geometry"
import { CubeGeometry } from "./geometry/cube-geometry"
import { MeshGeometry3D } from "./geometry/mesh-geometry"
import { Container3D } from "../container"
import { QuadGeometry } from "./geometry/quad-geometry"
import { Skin } from "../skinning/skin"
import { InstancedMesh3D } from "./instanced-mesh"
import { Material } from "../material/material"
import { StandardMaterial } from "../material/standard/standard-material"
import { MeshDestroyOptions } from "./mesh-destroy-options"
import { Vec3 } from "../math/vec3"
import { AABB } from "../math/aabb"
import { SphereGeometry, SphereGeometryOptions } from "./geometry/sphere-geometry"

/**
 * Represents a mesh which contains geometry and has a material.
 */
export class Mesh3D extends Container3D {

  /** The name of the plugin used for rendering the mesh. */
  pluginName = "pipeline"

  /** Array of weights used for morphing between geometry targets. */
  targetWeights?: number[]

  /** The skin used for vertex skinning. */
  skin?: Skin

  /** The enabled render passes for this mesh. */
  enabledRenderPasses: { [name: string]: unknown } = { "material": {} }

  /** Used for sorting the mesh before render. */
  renderSortOrder = 0

  /**
   * Specify that this mesh is to only draw the instances
   */
  instanceOnly = false

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

  private _instances: InstancedMesh3D[] = []

  /** An array of instances created from this mesh. */
  get instances() {
    return this._instances
  }

  /**
   * Creates a new instance of this mesh.
   */
  createInstance() {
    if (this.material && !this.material.isInstancingSupported) {
      throw new Error("PIXI3D: Can't create instance of mesh, material does not support instancing.")
    }
    return this._instances[
      this._instances.push(new InstancedMesh3D(this, this.material?.createInstance())) - 1
    ]
  }

  /**
   * Removes an instance from this mesh.
   * @param instance The instance to remove.
   */
  removeInstance(instance: InstancedMesh3D) {
    const index = this._instances.indexOf(instance)
    if (index >= 0) {
      this._instances.splice(index, 1)
    }
  }

  /**
   * Enables the render pass with the specified name.
   * @param name The name of the render pass to enable.
   */
  enableRenderPass(name: string, options?: unknown) {
    if (!this.enabledRenderPasses[name]) {
      this.enabledRenderPasses[name] = options || {}
    }
  }

  /**
   * Disables the render pass with the specified name.
   * @param name The name of the render pass to disable.
   * @param options The options for the render pass.
   */
  disableRenderPass(name: string) {
    if (this.enabledRenderPasses[name]) {
      delete this.enabledRenderPasses[name]
    }
  }

  /**
   * Returns a value indicating if the specified render pass is enabled.
   * @param name The name of the render pass to check.
   */
  isRenderPassEnabled(name: string) {
    return !!this.enabledRenderPasses[name]
  }

  /**
   * Destroys the mesh and it's used resources.
   */
  destroy(options?: boolean | MeshDestroyOptions) {
    if (options === true || (options && options.geometry)) {
      this.geometry.destroy()
    }
    if (options === true || (options && options.material)) {
      if (this.material) {
        this.material.destroy()
      }
    }
    super.destroy(options)
  }

  _render(renderer: Renderer) {
    renderer.batch.setObjectRenderer(
      <ObjectRenderer>(<any>renderer.plugins)[this.pluginName]
    );
    if (this.skin) {
      this.skin.calculateJointMatrices()
    }
    <ObjectRenderer>(<any>renderer.plugins)[this.pluginName].render(this)
  }

  /**
   * Calculates and returns a axis-aligned bounding box of the mesh in world space.
   */
  getBoundingBox() {
    if (!this.geometry.positions?.min) {
      return undefined
    }
    if (!this.geometry.positions?.max) {
      return undefined
    }
    let min = Vec3.transformMat4(
      <any>this.geometry.positions.min, this.worldTransform.array)
    let max = Vec3.transformMat4(
      <any>this.geometry.positions.max, this.worldTransform.array)
    for (let i = 0; i < 3; i++) {
      let temp = min[i]
      min[i] = Math.min(min[i], max[i])
      max[i] = Math.max(temp, max[i])
    }
    return AABB.from({ min, max })
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

  /**
   * Creates a new uv sphere mesh with the specified material.
   * @param material The material to use.
   * @param options The options used when creating the geometry.
   */
  static createSphere(material: Material = new StandardMaterial(), options?: SphereGeometryOptions) {
    return new Mesh3D(SphereGeometry.create(options), material)
  }
}