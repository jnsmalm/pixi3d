export namespace Mat3 {
  export function multiply(a: Float32Array, b: Float32Array, out: Float32Array) {    
	let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b00 = b[0], b01 = b[1], b02 = b[2], b10 = b[3], b11 = b[4], b12 = b[5], b20 = b[6], b21 = b[7], b22 = b[8]; out[0] = b00 * a00 + b01 * a10 + b02 * a20, out[1] = b00 * a01 + b01 * a11 + b02 * a21, out[2] = b00 * a02 + b01 * a12 + b02 * a22, out[3] = b10 * a00 + b11 * a10 + b12 * a20, out[4] = b10 * a01 + b11 * a11 + b12 * a21, out[5] = b10 * a02 + b11 * a12 + b12 * a22, out[6] = b20 * a00 + b21 * a10 + b22 * a20, out[7] = b20 * a01 + b21 * a11 + b22 * a21, out[8] = b20 * a02 + b21 * a12 + b22 * a22; return out;
  }
}