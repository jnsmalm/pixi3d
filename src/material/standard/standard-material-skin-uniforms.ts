import { Shader } from "@pixi/core"

import { Mesh3D } from "../../mesh/mesh"
import { StandardMaterialMatrixTexture } from "./standard-material-matrix-texture"

export class StandardMaterialSkinUniforms {
  private _jointMatrixTexture?: StandardMaterialMatrixTexture
  private _jointNormalTexture?: StandardMaterialMatrixTexture

  enableJointMatrixTextures(jointsCount: number) {
    if (!this._jointMatrixTexture) {
      this._jointMatrixTexture = new StandardMaterialMatrixTexture(jointsCount)
    }
    if (!this._jointNormalTexture) {
      this._jointNormalTexture = new StandardMaterialMatrixTexture(jointsCount)
    }
  }

  destroy() {
    this._jointNormalTexture?.destroy(true)
    this._jointMatrixTexture?.destroy(true)
  }

  update(mesh: Mesh3D, shader: Shader) {
    if (!mesh.skin) {
      return
    }
    if (this._jointMatrixTexture) {
      this._jointMatrixTexture.updateBuffer(mesh.skin.jointMatrices)
      shader.uniforms.u_jointMatrixSampler = this._jointMatrixTexture
    } else {
      shader.uniforms.u_jointMatrix = mesh.skin.jointMatrices
    }
    if (this._jointNormalTexture) {
      this._jointNormalTexture.updateBuffer(mesh.skin.jointNormalMatrices)
      shader.uniforms.u_jointNormalMatrixSampler = this._jointNormalTexture
    } else {
      shader.uniforms.u_jointNormalMatrix = mesh.skin.jointNormalMatrices
    }
  }
}