import { Buffer, Geometry } from "@pixi/core"
import { Camera, Quat, Vec3 } from "../.."

import { InstancedMesh3D } from "../../mesh/instanced-mesh"
import { InstancedSpriteMaterial } from "./instanced-sprite-material";

export class SpriteShaderInstancing {
  private _maxInstances = 200

  private _modelMatrix: Buffer[] = [
    new Buffer(), new Buffer(), new Buffer(), new Buffer()
  ];
  private _textureTransform: Buffer[] = [
    new Buffer(), new Buffer(), new Buffer()
  ];
  private _instanceColor = new Buffer();
  private _origin = new Buffer();
  private _texSize = new Buffer();

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
    for (let i = 0; i < 3; i++) {
      this._textureTransform[i].update(new Float32Array(3 * this._maxInstances))
    }
    this._instanceColor.update(new Float32Array(4 * this._maxInstances))
    this._origin.update(new Float32Array(3 * this._maxInstances))
    this._texSize.update(new Float32Array(2 * this._maxInstances))
  }

  updateBuffers(instances: InstancedMesh3D[], zSort: boolean = false) {
    if (instances.length > this._maxInstances) {
      this.expandBuffers(instances.length)
    }

    //if we support opaque sprites we can avoid this zSorting
    if (zSort) {
      const cameraForward = Vec3.transformQuat(Vec3.set(0, 0, 1), Camera.main.rotationQuaternion.array);
      instances.sort((instanceA, instanceB) => {
        //squared distance should perform better as no square root calculations done
        const aDirection = Vec3.subtract(Camera.main.position.array, instanceA.transform.position.array);
        const bDirection = Vec3.subtract(Camera.main.position.array, instanceB.transform.position.array);
        const aProjection = Vec3.scale(cameraForward, Vec3.dot(aDirection, cameraForward));
        const bProjection = Vec3.scale(cameraForward, Vec3.dot(bDirection, cameraForward));

        const aDistance = Math.pow(aProjection[0], 2) + Math.pow(aProjection[1], 2) + Math.pow(aProjection[2], 2);
        const bDistance = Math.pow(bProjection[0], 2) + Math.pow(bProjection[1], 2) + Math.pow(bProjection[2], 2);
        return bDistance - aDistance;
      });
    }

    let bufferIndex = 0

    for (let i = 0; i < instances.length; i++) {
      const model = instances[i].worldTransform.array;
      for (let j = 0; j < 4; j++) {
        (<Float32Array>this._modelMatrix[j].data)
          .set(model.slice(j * 4, j * 4 + 4), bufferIndex * 4)
      }

      const material = <InstancedSpriteMaterial>instances[i].material;
      (<Float32Array>this._instanceColor.data)
        .set(material.instanceColor.rgba, bufferIndex * 4);

      const textureTransform = material.textureTransform.array;
      for (let j = 0; j < 3; j++) {
        (<Float32Array>this._textureTransform[j].data)
          .set(textureTransform.slice(j * 3, j * 3 + 3), bufferIndex * 3)
      }

      (<Float32Array>this._origin.data)
        .set(material.origin, bufferIndex * 3);

      (<Float32Array>this._texSize.data)
        .set(new Float32Array([material.texture?.width || 100, material.texture?.height || 100]), bufferIndex * 2);

      bufferIndex++
    }

    for (let i = 0; i < 4; i++) {
      this._modelMatrix[i].update();
    }
    for (let i = 0; i < 3; i++) {
      this._textureTransform[i].update();
    }
    this._origin.update();
    this._texSize.update();
    this._instanceColor.update();
  }

  addGeometryAttributes(geometry: Geometry) {
    for (let i = 0; i < 4; i++) {
      geometry.addAttribute(`a_ModelMatrix${i}`,
        this._modelMatrix[i], 4, false, undefined, 0, undefined, true)
    }
    for (let i = 0; i < 3; i++) {
      geometry.addAttribute(`a_UVTransform${i}`,
        this._textureTransform[i], 3, false, undefined, 0, undefined, true)
    }
    geometry.addAttribute("a_Origin",
      this._origin, 3, false, undefined, 0, undefined, true)

    geometry.addAttribute("a_TexSize",
      this._texSize, 2, false, undefined, 0, undefined, true)

    geometry.addAttribute("a_InstanceColor",
      this._instanceColor, 4, false, undefined, 0, undefined, true)
  }
}