import { Buffer, Geometry } from "@pixi/core"
import { InstancedMesh3D } from ".."

export class ShadowShaderInstancing {
  private _maxInstances = 20

  private _modelMatrix: Buffer[] = [
    new Buffer(), new Buffer(), new Buffer(), new Buffer()
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
    }
  }

  updateBuffers(instances: InstancedMesh3D[]) {
    if (instances.length > this._maxInstances) {
      this.expandBuffers(instances.length)
    }
    for (let i = 0; i < instances.length; i++) {
      const model = instances[i].worldTransform.array
      for (let j = 0; j < 4; j++) {
        (<Float32Array>this._modelMatrix[j].data)
          .set(model.slice(j * 4, j * 4 + 4), i * 4)
      }
    }

    for (let i = 0; i < 4; i++) {
      this._modelMatrix[i].update()
    }
  }

  addGeometryAttributes(geometry: Geometry) {
    for (let i = 0; i < 4; i++) {
      geometry.addAttribute(`a_ModelMatrix${i}`,
        this._modelMatrix[i], 4, false, undefined, 0, undefined, true)
    }
  }
}