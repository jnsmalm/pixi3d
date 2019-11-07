export namespace Interpolate {
  export function cubicSpline(prevKey: number, nextKey: number, output: ArrayLike<number>, keyDelta: number, t: number, stride: number) {
    // stride: Count of components (4 in a quaternion).
    // Scale by 3, because each output entry consist of two tangents and one data-point.
    const prevIndex = prevKey * stride * 3;
    const nextIndex = nextKey * stride * 3;
    const A = 0;
    const V = 1 * stride;
    const B = 2 * stride;

    const result = new Float32Array(stride);
    const tSq = t ** 2;
    const tCub = t ** 3;

    // We assume that the components in output are laid out like this: in-tangent, point, out-tangent.
    // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#appendix-c-spline-interpolation
    for (let i = 0; i < stride; ++i) {
      const v0 = output[prevIndex + i + V];
      const a = keyDelta * output[nextIndex + i + A];
      const b = keyDelta * output[prevIndex + i + B];
      const v1 = output[nextIndex + i + V];

      result[i] = ((2 * tCub - 3 * tSq + 1) * v0) + ((tCub - 2 * tSq + t) * b) + ((-2 * tCub + 3 * tSq) * v1) + ((tCub - tSq) * a);
    }

    return result;
  }
}