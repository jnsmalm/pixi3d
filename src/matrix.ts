import { mat4 } from "gl-matrix"

export namespace Matrix {
  const matrix = mat4.create()

  export function transposeInverse(input: any, output: any) {
    return mat4.transpose(output, mat4.invert(matrix, input))
  }
}