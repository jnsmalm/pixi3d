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

  update(mesh: Mesh3D, shader: PIXI.Shader) {
    if (!mesh.skin) {
      return
    }
    let { jointVertexMatrices, jointNormalMatrices } = mesh.skin.calculateJointMatrices()
    if (this._jointMatrixTexture) {
      this._jointMatrixTexture.updateBuffer(jointVertexMatrices)
      shader.uniforms.u_jointMatrixSampler = this._jointMatrixTexture
    } else {
      shader.uniforms.u_jointMatrix = jointVertexMatrices
    }
    if (this._jointNormalTexture) {
      this._jointNormalTexture.updateBuffer(jointNormalMatrices)
      shader.uniforms.u_jointNormalMatrixSampler = this._jointNormalTexture
    } else {
      shader.uniforms.u_jointNormalMatrix = jointNormalMatrices
    }
  }
}