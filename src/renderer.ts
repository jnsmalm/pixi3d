import { Mesh3D } from "./mesh"
import { MaterialAlphaMode } from "./material"

export class StandardRenderer extends PIXI.ObjectRenderer {
  private opaque: Mesh3D[] = []
  private alpha: Mesh3D[] = []

  private cullBackfaceState: PIXI.State
  private cullFrontFaceState: PIXI.State
  private doubleSidedState: PIXI.State

  constructor(renderer: any) {
    super(renderer)

    this.cullBackfaceState = new PIXI.State()
    this.cullBackfaceState.culling = true
    this.cullBackfaceState.clockwiseFrontFace = false
    this.cullBackfaceState.depthTest = true

    this.cullFrontFaceState = new PIXI.State()
    this.cullFrontFaceState.culling = true
    this.cullFrontFaceState.clockwiseFrontFace = true
    this.cullFrontFaceState.depthTest = true

    this.doubleSidedState = new PIXI.State()
    this.doubleSidedState.culling = false
    this.doubleSidedState.depthTest = true
  }

  start() {
    this.opaque = []
    this.alpha = []
  }

  flush() {
    for (let obj of this.opaque) {
      if (obj.material.doubleSided) {
        this.renderMesh(obj, this.doubleSidedState)
      } else{
        this.renderMesh(obj, this.cullBackfaceState)
      }
    }
    this.opaque = []
    for (let obj of this.alpha) {
      if (obj.material.doubleSided) {
        this.renderMesh(obj, this.doubleSidedState)
      }
    }
    for (let obj of this.alpha) {
      if (!obj.material.doubleSided) {
        this.renderMesh(obj, this.cullFrontFaceState)
      }
    }
    for (let obj of this.alpha) {
      if (!obj.material.doubleSided) {
        this.renderMesh(obj, this.cullBackfaceState)
      }
    }
    this.alpha = []
  }

  renderMesh(obj: Mesh3D, state: PIXI.State) {
    obj.mesh.shader.transform = obj.transform
    obj.mesh.shader.material = obj.material
    obj.mesh.shader.weights = obj.mesh.geometry.weights

    if (obj.mesh.shader.update) {
      obj.mesh.shader.update();
    }
    this.renderer.shader.bind(obj.shader);
    this.renderer.state.set(state);
    this.renderer.geometry.bind(obj.mesh.geometry, obj.shader);
    this.renderer.geometry.draw(obj.mesh.drawMode, obj.mesh.size, obj.mesh.start, obj.mesh.geometry.instanceCount);
  }

  render(object: Mesh3D) {
    if (object.material.alphaMode === MaterialAlphaMode.blend) {
      this.alpha.push(object)
    } else {
      this.opaque.push(object)
    }
  }
}

PIXI.Renderer.registerPlugin("standard", StandardRenderer)