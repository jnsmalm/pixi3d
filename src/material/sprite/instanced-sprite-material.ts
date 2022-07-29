import { Texture } from "@pixi/core";
import { TextureTransform } from "../..";
import { Color } from "../../color"
import { SpriteMaterial } from "./sprite-material"

/** Material for instanced meshes which uses the standard material. */
export class InstancedSpriteMaterial {
  /** The base color of the material. */
  public instanceColor: Color;
  public texture?: Texture;
  public textureTransform: TextureTransform;
  public origin: Float32Array;
  private source: SpriteMaterial;

  /** Creates a new instanced standard material from the specified material. */
  constructor(material: SpriteMaterial) {
    this.source = material;
    this.instanceColor = new Color(...material.baseColor.rgba)
    this.textureTransform = new TextureTransform();
    this.origin = Float32Array.from([0.5, 0.5, 0.5]);
  }

  public setTexture(texture: Texture) {
    if (this.source.texture?.baseTexture !== texture.baseTexture) {
      //mismatch of base texture - cannot be done
    }
    if (texture !== this.texture) {
      this.texture = texture;
      this.textureTransform = TextureTransform.fromTexture(texture);
    }
  }
}