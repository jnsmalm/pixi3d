import { mat4 } from "gl-matrix"

export namespace Matrix {
  const matrix = mat4.create()

  export function transposeInverse(input: mat4, output: mat4) {
    return mat4.transpose(output, mat4.invert(matrix, input) as mat4)
  }
}