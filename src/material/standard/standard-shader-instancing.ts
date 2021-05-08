import * as PIXI from "pixi.js"

import { InstancedMesh3D } from "../../mesh/instanced-mesh"
import { InstancedStandardMaterial } from "./instanced-standard-material"

export class StandardShaderInstancing {
  private _maxInstances = 200

  private _modelMatrix: PIXI.Buffer[] = [
    new PIXI.Buffer(), new PIXI.Buffer(), new PIXI.Buffer(), new PIXI.Buffer()
  ]
  private _normalMatrix: PIXI.Buffer[] = [
    new PIXI.Buffer(), new PIXI.Buffer(), new PIXI.Buffer(), new PIXI.Buffer()
  ]
  private _baseColor = new PIXI.Buffer()

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
    this._baseColor.update(new Float32Array(4 * this._maxInstances))
  }

  updateBuffers(instances: InstancedMesh3D[]) {
    instances = instances.filter(i => i.worldVisible)

    if (instances.length > this._maxInstances) {
      this.expandBuffers(instances.length)
    }
    for (let i = 0; i < instances.length; i++) {
      const normal = instances[i].transform.normalTransform.toArray()
      for (let j = 0; j < 4; j++) {
        (<Float32Array>this._normalMatrix[j].data)
          .set(normal.slice(j * 4, j * 4 + 4), i * 4)
      }
      const model = instances[i].worldTransform.toArray()
      for (let j = 0; j < 4; j++) {
        (<Float32Array>this._modelMatrix[j].data)
          .set(model.slice(j * 4, j * 4 + 4), i * 4)
      }
      const material = <InstancedStandardMaterial>instances[i].material;
      (<Float32Array>this._baseColor.data).set(material.baseColor.rgba, i * 4)
    }

    for (let i = 0; i < 4; i++) {
      this._modelMatrix[i].update()
      this._normalMatrix[i].update()
    }
    this._baseColor.update()
  }

  addGeometryAttributes(geometry: PIXI.Geometry) {
    for (let i = 0; i < 4; i++) {
      geometry.addAttribute(`a_ModelMatrix${i}`,
        this._modelMatrix[i], 4, false, undefined, 0, undefined, true)
    }
    for (let i = 0; i < 4; i++) {
      geometry.addAttribute(`a_NormalMatrix${i}`,
        this._normalMatrix[i], 4, false, undefined, 0, undefined, true)
    }
    geometry.addAttribute("a_BaseColorFactor",
      this._baseColor, 4, false, undefined, 0, undefined, true)
  }
}