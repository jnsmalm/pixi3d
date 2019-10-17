import { Camera3D } from "../camera"
import { MeshData } from "../mesh"
import { mat3 } from "gl-matrix"
import { Shader, ShaderFactory } from "../shader"
import { Transform3D } from "../transform"
import { Matrix } from "../matrix"
import { MetallicRoughnessMaterial } from "../material"
import { LightingEnvironment } from "../light"

export class BasicShaderFactory implements ShaderFactory {
  createShader(data: MeshData): Shader {
    if (data.normals && !data.texCoords) {
      return new BasicNormalShader()
    }
    if (data.normals && data.texCoords) {
      return new BasicNormalTextureShader()
    }
    if (!data.normals && data.texCoords) {
      return new BasicTextureShader()
    }
    return new BasicPositionShader()
  }
}

abstract class BasicShader extends PIXI.Shader implements Shader {
  private _transposedInversedWorld = mat3.create()

  material: MetallicRoughnessMaterial | undefined
  transform: Transform3D | undefined

  updateLighting() {
    if (this.transform) {
      this.uniforms.transposedInversedWorld = Matrix.transposedInversedWorld(
        this.transform.worldTransform, this._transposedInversedWorld)
    }
    let directionalLight = LightingEnvironment.main.directionalLight
    if (!directionalLight) {
      return
    }
    directionalLight.transform.updateLocalTransform()
    this.uniforms.directionalLight = directionalLight.transform.localPosition
  }

  update() {
    if (this.transform) {
      this.uniforms.world = this.transform.worldTransform
    }
    if (this.material) {
      this.uniforms.baseColor = this.material.baseColor
    }
    this.uniforms.viewProjection = Camera3D.main.viewProjection
  }

  updateTextures() {
    if (this.material && this.material.baseColorTexture) {
      this.uniforms.baseColorTexture = this.material.baseColorTexture
    }
  }

  createGeometry(data: MeshData) {
    let geometry = new PIXI.Geometry()
    if (data.positions) {
      geometry.addAttribute("position", data.positions, 3)
    }
    if (data.indices) {
      geometry.addIndex(new Uint16Array(data.indices))
    }
    return geometry
  }
}

export class BasicPositionShader extends BasicShader {
  constructor() {
    super(new PositionProgram())
  }
}

export class BasicNormalShader extends BasicShader {
  constructor() {
    super(new NormalProgram())
  }

  update() {
    this.updateLighting()
    super.update()
  }

  createGeometry(data: MeshData) {
    let geometry = super.createGeometry(data)
    if (data.normals) {
      geometry.addAttribute("normal", data.normals, 3)
    }
    return geometry
  }
}

export class BasicTextureShader extends BasicShader {
  constructor() {
    super(new TextureProgram())
  }

  update() {
    this.updateTextures()
    super.update()
  }

  createGeometry(data: MeshData) {
    let geometry = super.createGeometry(data)
    if (data.texCoords) {
      geometry.addAttribute("texCoord", data.texCoords, 2)
    }
    return geometry
  }
}

export class BasicNormalTextureShader extends BasicShader {
  constructor() {
    super(new NormalTextureProgram())
  }

  update() {
    this.updateTextures()
    this.updateLighting()
    super.update()
  }

  createGeometry(data: MeshData) {
    let geometry = super.createGeometry(data)
    if (data.normals) {
      geometry.addAttribute("normal", data.normals, 3)
    }
    if (data.texCoords) {
      geometry.addAttribute("texCoord", data.texCoords, 2)
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