import { Program, Renderer, State } from "@pixi/core"
import { DRAW_MODES } from "@pixi/constants"

import { MeshGeometry3D } from "../../mesh/geometry/mesh-geometry"
import { Mesh3D } from "../../mesh/mesh"
import { MeshShader } from "../../mesh/mesh-shader"
import { StandardShaderSource } from "../standard/standard-shader-source"
import { Shader as frag } from "./shader/sprite.frag"
import { Shader as vert } from "./shader/sprite.vert"
import { SpriteShaderInstancing } from "./sprite-shader-instancing"

export class SpriteShader extends MeshShader {
  private _instancing = new SpriteShaderInstancing()
  private blend: boolean = true;

  static build(renderer: Renderer, features: string[]) {
    let program = Program.from(
      StandardShaderSource.build(vert.source, features, renderer),
      StandardShaderSource.build(frag.source, features, renderer))
    const spriteShader = new SpriteShader(program);
    return spriteShader;
  }

  get name() {
    return "sprite-shader"
  }

  createShaderGeometry(geometry: MeshGeometry3D, instanced: boolean) {
    let result = super.createShaderGeometry(geometry, instanced)
    if (instanced) {
      this._instancing.addGeometryAttributes(result)
    }
    return result
  }

  render(mesh: Mesh3D, renderer: Renderer, state: State, drawMode: DRAW_MODES) {
    if (mesh.instances.length > 0) {
      const filteredInstances = mesh.instances.filter((instance) => instance.worldVisible && instance.renderable);
      if (filteredInstances.length === 0) {
        //early exit - this avoids us drawing the last known instance in the instance buffer
        return;
      }
      this._instancing.updateBuffers(mesh.instances, true)
    }
    super.render(mesh, renderer, state, drawMode)
  }
}