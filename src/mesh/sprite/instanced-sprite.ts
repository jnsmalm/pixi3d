import { Texture } from "@pixi/core";
import { IDestroyOptions } from "@pixi/display"
import { IPoint, Point } from "@pixi/math";
import { InstancedSpriteMaterial, Vec3 } from "../..";
import { InstancedMesh3D } from "../instanced-mesh"
import { SpriteMesh } from "./sprite-mesh"

export class InstancedSpriteMesh extends InstancedMesh3D {

  protected get spriteMaterial() {
    return this.material as InstancedSpriteMaterial;
  }

  public get origin(): IPoint {
    return new Point(this.spriteMaterial.origin[0], this.spriteMaterial.origin[1]);
  }

  public set origin(value: IPoint) {
    this.spriteMaterial.origin.set(Vec3.fromValues(value.x, value.y, 0.5));
  }

  public get texture(): Texture | undefined {
    return this.spriteMaterial.texture;
  }

  public set texture(texture: Texture | undefined) {
    if (texture) {
      this.spriteMaterial.setTexture(texture);
    }
  }

  constructor(mesh: SpriteMesh, material: InstancedSpriteMaterial) {
    super(mesh, material);
  }

  destroy(options: boolean | IDestroyOptions | undefined) {
    super.destroy(options)
    this.mesh.removeInstance(this)
  }
}