export namespace Vec3 {
  export function set(x: number, y: number, z: number, out: Float32Array) {
    out[0] = x; out[1] = y; out[2] = z; return out
  }
  export function add(a: Float32Array, b: Float32Array, out: Float32Array) {
    out[0] = a[0] + b[0]; out[1] = a[1] + b[1]; out[2] = a[2] + b[2]; return out
  }
  export function transformQuat(a: Float32Array, q: Float32Array, out: Float32Array) {
    let qx = q[0], qy = q[1], qz = q[2], qw = q[3]; let x = a[0], y = a[1], z = a[2]; let uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x; let uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx; let w2 = qw * 2; uvx *= w2; uvy *= w2; uvz *= w2; uuvx *= 2; uuvy *= 2; uuvz *= 2; out[0] = x + uvx + uuvx; out[1] = y + uvy + uuvy; out[2] = z + uvz + uuvz; return out
  }
  export function subtract(a: Float32Array, b: Float32Array, out: Float32Array) {
    out[0] = a[0] - b[0]; out[1] = a[1] - b[1]; out[2] = a[2] - b[2]; return out
  }
  export function scale(a: Float32Array, b: number, out: Float32Array) {
    out[0] = a[0] * b; out[1] = a[1] * b; out[2] = a[2] * b; return out
  }
  export function normalize(a: Float32Array, out: Float32Array) {
    let x = a[0]; let y = a[1]; let z = a[2]; let len = x * x + y * y + z * z; if (len > 0) { len = 1 / Math.sqrt(len); } out[0] = a[0] * len; out[1] = a[1] * len; out[2] = a[2] * len; return out;
  }
}