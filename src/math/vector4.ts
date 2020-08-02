export namespace Vector4 {
  export function set(x: number, y: number, z: number, w: number, out: Float32Array) {
    out[0] = x; out[1] = y; out[2] = z; out[3] = w; return out
  }
  export function transformMat4(a: Float32Array, m: Float32Array, out: Float32Array) {
    let x = a[0], y = a[1], z = a[2], w = a[3]; out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w; out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w; out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w; out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w; return out
  }
}