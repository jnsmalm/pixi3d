import { Renderer, Buffer } from "@pixi/core"
import { MeshGeometry3D } from "../mesh/geometry/mesh-geometry"
import { Mesh3D } from "../mesh/mesh"
import { Capabilities } from "../capabilities"
import { ShadowCastingLight } from "./shadow-casting-light"
import { ShadowShader } from "./shadow-shader"

export class SkinningShader extends ShadowShader {
  private _maxSupportedJoints: number

  get maxSupportedJoints() {
    return this._maxSupportedJoints
  }

  static getMaxJointCount(renderer: Renderer) {
    let uniformsRequiredForOtherFeatures = 8
    let availableVertexUniforms =
      Capabilities.getMaxVertexUniformVectors(renderer) - uniformsRequiredForOtherFeatures
    let uniformsRequiredPerJoint = 4
    return Math.floor(availableVertexUniforms / uniformsRequiredPerJoint)
  }

  constructor(renderer: Renderer) {
    // When setting the MAX_JOINT_COUNT, it needs to be subtracted by 1 for
    // some reason. Otherwise it will exceeed maximum vertex uniforms.
    const maxJointCount = SkinningShader.getMaxJointCount(renderer) - 1
    super(renderer, ["USE_SKINNING 1", "MAX_JOINT_COUNT " + maxJointCount])
    this._maxSupportedJoints = maxJointCount
  }

  createShaderGeometry(geometry: MeshGeometry3D, instanced: boolean) {
    let result = super.createShaderGeometry(geometry, instanced)
    if (geometry.joints) {
      result.addAttribute("a_Joint1", new Buffer(geometry.joints.buffer),
        4, false, geometry.joints.componentType, geometry.joints.stride)
    }
    if (geometry.weights) {
      result.addAttribute("a_Weight1", new Buffer(geometry.weights.buffer),
        4, false, geometry.weights.componentType, geometry.weights.stride)
    }
    return result
  }

  get name() {
    return "skinned-shadow-shader"
  }

  updateUniforms(mesh: Mesh3D, shadowCastingLight: ShadowCastingLight) {
    super.updateUniforms(mesh, shadowCastingLight)
    if (!mesh.skin) {
      return
    }
    this.uniforms.u_jointMatrix = mesh.skin.jointMatrices
  }
}