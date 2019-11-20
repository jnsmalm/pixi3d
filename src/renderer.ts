import { Mesh3D } from "./mesh"
import { MaterialAlphaMode } from "./material"

function createState(culling: boolean, clockwiseFrontFace: boolean) {
  return Object.assign(new PIXI.State(), { culling, clockwiseFrontFace, depthTest: true })
}

const cullBackfaceState = createState(true, false)
const cullFrontFaceState = createState(true, true)
const doubleSidedState = createState(false, false)

export class Mesh3DRenderer extends PIXI.ObjectRenderer {
  private opaque: Mesh3D[] = []
  private alpha: Mesh3D[] = []

  constructor(renderer: any) {
    super(renderer)
  }

  start() {
    this.opaque = []
    this.alpha = []
  }

  flush() {
    for (let obj of this.opaque) {
      if (obj.material.doubleSided) {
        this.renderMesh(obj, doubleSidedState)
      } else {
        this.renderMesh(obj, cullBackfaceState)
      }
    }
    this.opaque = []
    for (let obj of this.alpha) {
      if (obj.material.doubleSided) {
        this.renderMesh(obj, doubleSidedState)
      }
    }
    for (let obj of this.alpha) {
      if (!obj.material.doubleSided) {
        this.renderMesh(obj, cullFrontFaceState)
      }
    }
    for (let obj of this.alpha) {
      if (!obj.material.doubleSided) {
        this.renderMesh(obj, cullBackfaceState)
      }
    }
    this.alpha = []
  }

  renderMesh(mesh: Mesh3D, state: PIXI.State) {
    mesh.shader.updateUniforms(mesh)
    
    this.renderer.shader.bind(mesh.shader)
    this.renderer.state.set(state)
    this.renderer.geometry.bind(mesh.geometry, mesh.shader)
    this.renderer.geometry.draw(PIXI.DRAW_MODES.TRIANGLES)
  }

  render(mesh: Mesh3D) {
    if (mesh.material.alphaMode === MaterialAlphaMode.blend) {
      this.alpha.push(mesh)
    } else {
      this.opaque.push(mesh)
    }
  }
}

PIXI.Renderer.registerPlugin("mesh3d", Mesh3DRenderer)