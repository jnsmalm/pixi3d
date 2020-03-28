import { Quaternion } from "../../math/quaternion"

function cubicSpline(t: number, p0: number, p1: number, m0: number, m1: number) {
  return ((2 * (t ** 3) - 3 * (t ** 2) + 1) * p0) + (((t ** 3) - 2 * (t ** 2) + t) * m0) + ((-2 * (t ** 3) + 3 * (t ** 2)) * p1) + (((t ** 3) - (t ** 2)) * m1)
}

export interface glTFInterpolation {
  interpolate(frame: number, position: number): Float32Array
}

export class glTFCubicSplineInterpolation implements glTFInterpolation {
  private array: Float32Array

  constructor(private input: Float32Array, private output: Float32Array, private stride: number) {
    this.array = new Float32Array(stride)
  }

  interpolate(frame: number, position: number) {
    const diff = this.input[frame + 1] - this.input[frame]
    const pos1 = (frame + 0) * this.stride * 3
    const pos2 = (frame + 1) * this.stride * 3
    for (let i = 0; i < this.stride; i++) {
      this.array[i] = cubicSpline(position, this.output[pos1 + i + 1 * this.stride], this.output[pos2 + i + 1 * this.stride], diff * this.output[pos2 + i], diff * this.output[pos1 + i + 2 * this.stride])
    }
    return this.array
  }
}

export class glTFStepInterpolation implements glTFInterpolation {
  private array: Float32Array

  constructor(private output: Float32Array, private stride: number) {
    this.array = new Float32Array(stride)
  }

  interpolate(frame: number) {
    for (let i = 0; i < this.stride; i++) {
      this.array[i] = this.output[frame * this.stride + i]
    }
    return this.array
  }
}

export class glTFLinearInterpolation implements glTFInterpolation {
  private array: Float32Array

  constructor(private output: Float32Array, private stride: number) {
    this.array = new Float32Array(stride)
  }

  interpolate(frame: number, position: number) {
    let pos1 = (frame + 0) * this.stride
    let pos2 = (frame + 1) * this.stride
    for (let i = 0; i < this.stride; i++) {
      this.array[i] = (1 - position) * this.output[pos1 + i] + position * this.output[pos2 + i]
    }
    return this.array
  }
}

export class glTFSphericalLinearInterpolation implements glTFInterpolation {
  private quat1 = Quaternion.create()
  private quat2 = Quaternion.create()
  private array = Quaternion.create()

  constructor(private output: Float32Array) {
  }

  interpolate(frame: number, position: number) {
    let pos1 = (frame + 0) * 4
    let pos2 = (frame + 1) * 4
    let a = Quaternion.set(
      this.output[pos1], this.output[pos1 + 1], this.output[pos1 + 2], this.output[pos1 + 3], this.quat1
    )
    let b = Quaternion.set(
      this.output[pos2], this.output[pos2 + 1], this.output[pos2 + 2], this.output[pos2 + 3], this.quat2
    )
    return Quaternion.normalize(Quaternion.slerp(a, b, position, this.array), this.array) as Float32Array
  }
}