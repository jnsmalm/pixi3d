import { TransformId } from "./transform-id"

export class MatrixComponent<T> {
  private _id?: number

  constructor(private _parent: TransformId, private _data: T, private _update: (data: T) => void) { }

  get data() {
    if (this._id !== this._parent.transformId) {
      this._update(this._data); this._id = this._parent.transformId
    }
    return this._data
  }
}