import { mat4, mat3 } from "gl-matrix"

export namespace Matrix {
  const matrix = mat4.create()

  export function transposedInversedWorld(input: mat4, output: mat3) {
    return mat3.transpose(output,
      mat3.fromMat4(output, mat4.invert(matrix, input) as mat4))
  }
}