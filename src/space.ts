import { Matrix } from "./matrix"
import { vec4 } from "gl-matrix"

export namespace ScreenSpace {
  let invertedViewProjection = new Float32Array(16)
  let positionInClipSpace = new Float32Array(4)

  export function toWorld(x: number, y: number, z: number, width: number, height: number, viewProjection: Float32Array) {
    Matrix.invert(viewProjection, invertedViewProjection)

    positionInClipSpace.set([
      (x / width) * 2 - 1, ((y / height) * 2 - 1) * -1, z / 1, 1
    ])
    let positionInWorldSpace = vec4.transformMat4(
      positionInClipSpace, positionInClipSpace, invertedViewProjection)

    positionInWorldSpace[3] = 1.0 / positionInWorldSpace[3];
    for (let i = 0; i < 3; i++) {
      positionInWorldSpace[i] *= positionInWorldSpace[3];
    }
    return { 
      x: positionInWorldSpace[0], y: positionInWorldSpace[1], z: positionInWorldSpace[2]
    };
  }
}