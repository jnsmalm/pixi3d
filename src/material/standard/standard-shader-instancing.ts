import { Buffer, Geometry } from "@pixi/core"

import { InstancedMesh3D } from "../../mesh/instanced-mesh"
import { InstancedStandardMaterial } from "./instanced-standard-material"

const identityMat = new Float32Array([
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
]);

export class StandardShaderInstancing {
  private _maxInstances = 200

  private _modelMatrix: Buffer[] = [
    new Buffer(), new Buffer(), new Buffer(), new Buffer()
  ]
  private _normalMatrix: Buffer[] = [
    new Buffer(), new Buffer(), new Buffer(), new Buffer()
  ]
  private _baseColor = new Buffer()

  private _UVTransformMatrix: Buffer[] = [
    new Buffer(), new Buffer(), new Buffer()
  ]

  constructor() {
    this.expandBuffers(this._maxInstances)
  }

  expandBuffers(instanceCount: number) {
    while (instanceCount > this._maxInstances) {
      this._maxInstances += Math.floor(this._maxInstances * 0.5)
    }
    for (let i = 0; i < 4; i++) {
      this._modelMatrix[i].update(new Float32Array(4 * this._maxInstances))
      this._normalMatrix[i].update(new Float32Array(4 * this._maxInstances))
    }
    for (let i = 0; i < 3; i++) {
      this._UVTransformMatrix[i].update(new Float32Array(3 * this._maxInstances))
    }
    this._baseColor.update(new Float32Array(4 * this._maxInstances))
  }

  updateBuffers(instances: InstancedMesh3D[]) {
    if (instances.length > this._maxInstances) {
      this.expandBuffers(instances.length)
    }
    let bufferIndex = 0
    for (let i = 0; i < instances.length; i++) {
      const normal = instances[i].transform.normalTransform.array
      for (let j = 0; j < 4; j++) {
        (<Float32Array>this._normalMatrix[j].data)
          .set(normal.slice(j * 4, j * 4 + 4), bufferIndex * 4)
      }
      const model = instances[i].worldTransform.array
      for (let j = 0; j < 4; j++) {
        (<Float32Array>this._modelMatrix[j].data)
          .set(model.slice(j * 4, j * 4 + 4), bufferIndex * 4)
      }
      const material = <InstancedStandardMaterial>instances[i].material;
      (<Float32Array>this._baseColor.data)
        .set(material.baseColor.rgba, bufferIndex * 4);

      //substitute instance for base and if neither, identity 3x3 matrix
      const UVMatrix = material.instanceTexture?.transform?.array || material.referenceMaterial.baseColorTexture?.transform?.array || identityMat;
      for (let j = 0; j < 3; j++) {
        (<Float32Array>this._UVTransformMatrix[j].data)
          .set(UVMatrix.slice(j * 3, j * 3 + 3), bufferIndex * 3)
      }

      bufferIndex++
    }

    for (let i = 0; i < 4; i++) {
      this._modelMatrix[i].update()
      this._normalMatrix[i].update()
    }
    for (let i = 0; i < 3; i++) {
      this._UVTransformMatrix[i].update()
    }
    this._baseColor.update()
  }

  addGeometryAttributes(geometry: Geometry) {
    for (let i = 0; i < 4; i++) {
      geometry.addAttribute(`a_ModelMatrix${i}`,
        this._modelMatrix[i], 4, false, undefined, 0, undefined, true)
    }
    for (let i = 0; i < 4; i++) {
      geometry.addAttribute(`a_NormalMatrix${i}`,
        this._normalMatrix[i], 4, false, undefined, 0, undefined, true)
    }
    for (let i = 0; i < 3; i++) {
      geometry.addAttribute(`a_BaseColorUVTransform${i}`,
        this._UVTransformMatrix[i], 3, false, undefined, 0, undefined, true)
    }

    geometry.addAttribute("a_BaseColorFactor",
      this._baseColor, 4, false, undefined, 0, undefined, true)
  }
}