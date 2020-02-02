import { Mesh3D } from "./mesh"

/**
 * Renders 3d meshes in sorted order.
 */
export class Mesh3DRenderer extends PIXI.ObjectRenderer {
  private _objects: Mesh3D[] = []

  /**
   * Renders all added meshes in sorted order.
   */
  flush() {
    this.sort()
    for (let mesh of this._objects) {
      mesh.material.render(mesh, this.renderer)
    }
    this._objects = []
  }

  /**
   * Sorts all added meshes by material transparency.
   */
  sort() {
    this._objects.sort((a, b) => {
      if (a.material.transparent === b.material.transparent) {
        return 0;
      }
      return a.material.transparent ? 1 : -1
    })
  }

  /**
   * Adds a mesh to be rendered.
   * @param mesh Mesh to add.
   */
  render(mesh: Mesh3D) {
    this._objects.push(mesh)
  }
}

if (PIXI) {
  PIXI.Renderer.registerPlugin("mesh3d", Mesh3DRenderer)
}