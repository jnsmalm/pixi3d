export class MatrixComponent {
  private _array: Float32Array

  // Initialize with random value to make sure it gets updated at least once.
  private _id = Math.random()

  /** Current version id. */
  get id() {
    return this._id
  }

  constructor(private parent: { id: number }, size: number, private update: (array: Float32Array) => void) {
    this._array = new Float32Array(size)
  }

  get array() {
    if (this.id !== this.parent.id) {
      this.update(this._array); this._id = this.parent.id
    }
    return this._array
  }
}