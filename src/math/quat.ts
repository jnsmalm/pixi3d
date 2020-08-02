export namespace Quat {
  export function set(x: number, y: number, z: number, w: number, out: Float32Array) {
    out[0] = x; out[1] = y; out[2] = z; out[3] = w; return out
  }
  export function normalize(a: Float32Array, out: Float32Array) {
    let x = a[0], y = a[1], z = a[2], w = a[3], len = x * x + y * y + z * z + w * w; if (len > 0) { len = 1 / Math.sqrt(len) } out[0] = x * len; out[1] = y * len; out[2] = z * len; out[3] = w * len; return out
  }
  export function slerp(a: Float32Array, b: Float32Array, t: number, out: Float32Array) {
    let ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3], omega, cosom = ax * bx + ay * by + az * bz + aw * bw, sinom, scale0, scale1; if (cosom < 0.0) { cosom = -cosom; bx = -bx; by = -by; bz = -bz; bw = -bw } if (1.0 - cosom > 0.000001) { omega = Math.acos(cosom); sinom = Math.sin(omega); scale0 = Math.sin((1.0 - t) * omega) / sinom; scale1 = Math.sin(t * omega) / sinom } else { scale0 = 1.0 - t; scale1 = t } out[0] = scale0 * ax + scale1 * bx; out[1] = scale0 * ay + scale1 * by; out[2] = scale0 * az + scale1 * bz; out[3] = scale0 * aw + scale1 * bw; return out
  }
  export function fromEuler(x: number, y: number, z: number, out: Float32Array) {
    let halfToRad = (0.5 * Math.PI) / 180.0; x *= halfToRad; y *= halfToRad; z *= halfToRad; let sx = Math.sin(x); let cx = Math.cos(x); let sy = Math.sin(y); let cy = Math.cos(y); let sz = Math.sin(z); let cz = Math.cos(z); out[0] = sx * cy * cz - cx * sy * sz; out[1] = cx * sy * cz + sx * cy * sz; out[2] = cx * cy * sz - sx * sy * cz; out[3] = cx * cy * cz + sx * sy * sz; return out
  }
}