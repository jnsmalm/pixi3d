import { Mat4 } from "../math/mat4"
import { Container3D } from "../container"
import { Joint } from "./joint"

/**
 * Represents a skin used for vertex skinning.
 */
export class Skin {
  /**
   * Creates a new skin.
   * @param parent The parent container node for the skin.
   * @param joints The array of joints included in the skin.
   */
  constructor(public parent: Container3D, public joints: Joint[]) {
    this._jointVertexMatrices = new Float32Array(joints.length * 16)
    this._jointNormalMatrices = new Float32Array(joints.length * 16)
    for (let i = 0; i < joints.length; i++) {
      this._arrayVertexMatrices.push(new Float32Array(this._jointVertexMatrices.buffer, 16 * 4 * i, 16))
      this._arrayNormalMatrices.push(new Float32Array(this._jointNormalMatrices.buffer, 16 * 4 * i, 16))
    }
  }

  private _jointVertexMatrices: Float32Array
  private _arrayVertexMatrices: Float32Array[] = []
  private _jointNormalMatrices: Float32Array
  private _arrayNormalMatrices: Float32Array[] = []

  /**
   * Calculates the joint matrices.
   */
  calculateJointMatrices() {
    for (let i = 0; i < this.joints.length; i++) {
      /* The vertices have to be transformed with the current global transform 
      of the joint node. Together with the transformation from the 
      inverseBindMatrix, this will cause the vertices to be transformed only 
      based on the current transform of the node, in the coordinate space of the 
      current joint node. */
      Mat4.multiply(<Float32Array><unknown>this.joints[i].node.worldTransform.array,
        this.joints[i].inverseBindMatrix, this._arrayVertexMatrices[i])

      /* The vertices have to be transformed with inverse of the global 
      transform of the node that the mesh is attached to, because this transform 
      is already done using the model-view-matrix, and thus has to be cancelled 
      out from the skinning computation. */
      Mat4.multiply(<Float32Array><unknown>this.parent.transform.inverseWorldTransform.array,
        this._arrayVertexMatrices[i], this._arrayVertexMatrices[i])

      Mat4.invert(this._arrayVertexMatrices[i], this._arrayNormalMatrices[i])
      Mat4.transpose(this._arrayNormalMatrices[i], this._arrayNormalMatrices[i])
    }
    return {
      jointVertexMatrices: this._jointVertexMatrices,
      jointNormalMatrices: this._jointNormalMatrices
    }
  }
}
