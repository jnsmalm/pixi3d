/**
 * Represents a specific interpolation method.
 */
export interface glTFInterpolation {
  /**
   * Interpolates within an animation frame and returns the output.
   * @param frame The animation frame to interpolate.
   * @param position The position within the animation frame (between 0-1).
   */
  interpolate(frame: number, position: number): Float32Array
}

export function getDenormalizeFunction(output: ArrayLike<number>, stride: number): (data: Float32Array) => Float32Array {
	switch ( output.constructor ) {

		case Float32Array:

			return (data: Float32Array) => data;

		case Uint32Array:

      return (data: Float32Array) => {
        for (let i = 0; i < stride; i++) {
          data[i] = data[i] / 4294967295.0;
        }
        return data;
      };

		case Uint16Array:

      return (data: Float32Array) => {
        for (let i = 0; i < stride; i++) {
          data[i] = data[i] / 65535.0;
        }
        return data;
      };

		case Uint8Array:

      return (data: Float32Array) => {
        for (let i = 0; i < stride; i++) {
          data[i] = data[i] / 255.0;
        }
        return data;
      };

		case Int32Array:

      return (data: Float32Array) => {
        for (let i = 0; i < stride; i++) {
          data[i] = Math.max( data[i] / 2147483647.0, - 1.0 );
        }
        return data;
      };

		case Int16Array:

      return (data: Float32Array) => {
        for (let i = 0; i < stride; i++) {
          data[i] = Math.max( data[i] / 32767.0, - 1.0 );
        }
        return data;
      };

		case Int8Array:


      return (data: Float32Array) => {
        for (let i = 0; i < stride; i++) {
          data[i] = Math.max( data[i] / 127.0, - 1.0 );
        }
        return data;
      };

		default:

			throw new Error( 'Invalid component type.' );

	}
}