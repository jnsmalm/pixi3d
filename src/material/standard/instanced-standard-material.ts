import { Color } from "../../color"
import { StandardMaterial } from "./standard-material"
import { StandardMaterialTexture } from "./standard-material-texture"

/** Material for instanced meshes which uses the standard material. */
export class InstancedStandardMaterial {
  /** The base color of the material. */
  baseColor: Color
  private _instanceTexture: StandardMaterialTexture | undefined
  private _instanceTextureIndex: number = -1

  public set instanceTexture(texture: StandardMaterialTexture | undefined) {
    if (texture) {
      const index = this.referenceMaterial.textureIndicesMap.get(texture);
      if (!index) {
        //texture is not part of the spritesheet
      }
      console.log('setting instance texture: ', index, texture, this.referenceMaterial.textureIndicesMap);
      this._instanceTextureIndex = index || -1
    } else {
      this._instanceTextureIndex = -1
    }
    this._instanceTexture = texture;
  }
  public get instanceTexture(): StandardMaterialTexture | undefined {
    return this._instanceTexture
  }

  public get instanceTextureIndex() {
    return this._instanceTextureIndex > -1 ? this._instanceTextureIndex : this.referenceMaterial.textureIndex
  }

  /** Creates a new instanced standard material from the specified material. */
  constructor(public readonly referenceMaterial: StandardMaterial) {
    this.baseColor = new Color(...referenceMaterial.baseColor.rgba)
    this.instanceTexture = referenceMaterial.baseColorTexture
  }
}