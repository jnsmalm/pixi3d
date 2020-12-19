import * as PIXI from "pixi.js"

import { MeshGeometry3D } from "../mesh/geometry/mesh-geometry"
import { Mesh3D } from "../mesh/mesh"
import { ShadowCastingLight } from "./shadow-casting-light"
import { ShadowShader } from "./shadow-shader"
import { StandardMaterialMatrixTexture } from "../material/standard/standard-material-matrix-texture"

const MAX_SUPPORTED_JOINTS = 256

export class TextureShader extends ShadowShader {
  private _jointMatrixTexture: StandardMaterialMatrixTexture

  get maxSupportedJoints() {
    return MAX_SUPPORTED_JOINTS
  }

  static isSupported(renderer: PIXI.Renderer) {
    return StandardMaterialMatrixTexture.isSupported(renderer)
  }

  constructor() {
    super([
      "USE_SKINNING 1", "USE_SKINNING_TEXTURE 1", "MAX_JOINT_COUNT " + MAX_SUPPORTED_JOINTS
    ])
    this._jointMatrixTexture =
      new StandardMaterialMatrixTexture(MAX_SUPPORTED_JOINTS)
  }

  createShaderGeometry(geometry: MeshGeometry3D) {
    let result = super.createShaderGeometry(geometry)
    if (geometry.joints) {
      result.addAttribute("a_Joint1", new PIXI.Buffer(geometry.joints.buffer),
        4, false, geometry.joints.componentType, geometry.joints.stride)
    }
    if (geometry.weights) {
      result.addAttribute("a_Weight1", new PIXI.Buffer(geometry.weights.buffer),
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
    let { jointVertexMatrices } = mesh.skin.calculateJointMatrices()
    this._jointMatrixTexture.updateBuffer(jointVertexMatrices)
    this.uniforms.u_jointMatrixSampler = this._jointMatrixTexture
  }
}