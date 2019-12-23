import { Mesh3D } from "./mesh"

export class SortableMeshRenderer extends PIXI.ObjectRenderer {
  private objects: Mesh3D[] = []

  flush() {
    this.sort()
    for (let mesh of this.objects) {
      mesh.material.render(this.renderer)
    }
    this.objects = []
  }

  sort() {
    this.objects.sort((a, b) => {
      return (a.material.transparent === b.material.transparent) ? 0 : a.material.transparent ? 1 : -1
    })
  }

  render(mesh: Mesh3D) {
    this.objects.push(mesh)
  }
}

if (PIXI) {
  PIXI.Renderer.registerPlugin("sortable", SortableMeshRenderer)
}