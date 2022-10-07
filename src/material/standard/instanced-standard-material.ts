import { TextureTransform } from "../..";
import { Color } from "../../color"
import { StandardMaterial } from "./standard-material"
import { StandardMaterialTexture } from "./standard-material-texture"

/** Material for instanced meshes which uses the standard material. */
export class InstancedStandardMaterial {
  /** The base color of the material. */
  baseColor: Color
  private _instanceTexture: StandardMaterialTexture | undefined;

  public set instanceTexture(texture: StandardMaterialTexture | undefined) {
    if (!texture?.transform && texture?.frame && !texture?.noFrame) {
      texture.transform = TextureTransform.fromTexture(texture)
    }
    this._instanceTexture = texture;
  }
  public get instanceTexture(): StandardMaterialTexture | undefined {
    return this._instanceTexture;
  }

  /** Creates a new instanced standard material from the specified material. */
  constructor(public readonly referenceMaterial: StandardMaterial) {
    this.baseColor = new Color(...referenceMaterial.baseColor.rgba)
    this.instanceTexture = referenceMaterial.baseColorTexture;
  }
}