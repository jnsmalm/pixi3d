export namespace PickingId {
  let id = 0
  export function next() {
    id++
    return new Uint8Array([
      (id >> 16) & 255, (id >> 8) & 255, id & 255
    ])
  }
}