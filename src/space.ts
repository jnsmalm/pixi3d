import { Matrix } from "./matrix"
import { vec4 } from "gl-matrix"

export namespace ScreenSpace {
  let invertedViewProjection = new Float32Array(16)
  let positionInClipSpace = new Float32Array(4)

  export function toWorld(x: number, y: number, z: number, viewWidth: number, viewHeight: number, viewProjection: Float32Array) {
    Matrix.invert(viewProjection, invertedViewProjection)

    positionInClipSpace.set([
      (x / viewWidth) * 2 - 1, ((y / viewHeight) * 2 - 1) * -1, z / 1, 1
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

export namespace WorldSpace {
  const positionInWorldSpace = new Float32Array(4)

  export function toScreen(x: number, y: number, z: number, view: Float32Array, projection: Float32Array, viewWidth: number, viewHeight: number) {
    positionInWorldSpace.set([x, y, z, 1])

    let positionInClipSpace = vec4.transformMat4(
      positionInWorldSpace, positionInWorldSpace, view)

    positionInClipSpace = vec4.transformMat4(
      positionInClipSpace, positionInClipSpace, projection)

    if (positionInClipSpace[3] !== 0) {
      for (let i = 0; i < 3; i++) {
        positionInClipSpace[i] /= positionInClipSpace[3]
      }
    }
    return {
      x: (positionInClipSpace[0] + 1) / 2 * viewWidth,
      y: viewHeight - (positionInClipSpace[1] + 1) / 2 * viewHeight
    }
  }
}