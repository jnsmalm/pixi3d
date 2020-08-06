export class MatrixComponent {
  private _id?: number
  private _array: Float32Array

  constructor(private _parent: { id: number }, size: number, private _update: (array: Float32Array) => void) {
    this._array = new Float32Array(size)
  }

  get array() {
    if (this._id !== this._parent.id) {
      this._update(this._array); this._id = this._parent.id
    }
    return this._array
  }
}