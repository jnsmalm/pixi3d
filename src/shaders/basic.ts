import { Camera3D } from "../camera"
import { MeshData } from "../data"
import { mat3 } from "gl-matrix"
import { Shader } from "../shader"
import { Transform3D } from "../transform"
import { Matrix } from "../matrix"
import { DirectionalLight } from "../light"

export class BasicShader extends PIXI.Shader implements Shader {
  private _transposedInversedWorld = mat3.create()

  camera: Camera3D | undefined
  transform: Transform3D | undefined
  directionalLight = new DirectionalLight()
  texture: PIXI.Texture | undefined

  constructor(program: PIXI.Program, private features: { normal?: boolean, texture?: boolean } = {}) {
    super(program)
  }

  static from(data: MeshData) {
    if (data.normals && !data.texCoords) {
      return new BasicShader(new NormalProgram(), { normal: true })
    } else if (data.normals && data.texCoords) {
      return new BasicShader(new NormalTextureProgram(), { normal: true, texture: true })
    } else if (!data.normals && data.texCoords) {
      return new BasicShader(new TextureProgram(), { texture: true })
    }
    return new BasicShader(new PositionProgram())
  }

  get hasNormalFeature() {
    return this.features.normal
  }

  get hasTextureFeature() {
    return this.features.texture
  }

  update() {
    this.uniforms.viewProjection = Camera3D.main.viewProjection
    if (this.camera) {
      this.uniforms.viewProjection = this.camera.viewProjection
    }
    if (this.transform) {
      if (this.hasNormalFeature) {
        this.uniforms.transposedInversedWorld = Matrix.transposedInversedWorld(
          this.transform.worldTransform, this._transposedInversedWorld)
      }
      this.uniforms.world = this.transform.worldTransform
    }
    if (this.hasTextureFeature) {
      this.uniforms.texture = this.texture
    }
    if (this.hasNormalFeature) {
      this.directionalLight.transform.updateLocalTransform()
      this.uniforms.lightPosition = this.directionalLight.transform.localPosition
    }
  }

  createGeometry(data: MeshData) {
    let geometry = new PIXI.Geometry()
    if (data.positions) {
      geometry.addAttribute("position", data.positions, 3)
    }
    if (data.normals) {
      geometry.addAttribute("normal", data.normals, 3)
    }
    if (data.texCoords) {
      geometry.addAttribute("texCoord", data.texCoords, 2)
    }
    if (data.indices) {
      geometry.addIndex(new Uint16Array(data.indices))
    }
    return geometry
  }
}

class PositionProgram extends PIXI.Program {
  constructor() {
    super(
      require("./glsl/basic/position.vert").default,
      require("./glsl/basic/position.frag").default
    )
  }
}

class NormalProgram extends PIXI.Program {
  constructor() {
    super(
      require("./glsl/basic/normal.vert").default,
      require("./glsl/basic/normal.frag").default
    )
  }
}

class NormalTextureProgram extends PIXI.Program {
  constructor() {
    super(
      require("./glsl/basic/normal-texture.vert").default,
      require("./glsl/basic/normal-texture.frag").default
    )
  }
}

class TextureProgram extends PIXI.Program {
  constructor() {
    super(
      require("./glsl/basic/texture.vert").default,
      require("./glsl/basic/texture.frag").default
    )
  }
}