import { Texture } from "@pixi/core";
import { IPoint, IPointData, Point } from "@pixi/math";
import { Vec3 } from "../..";
import { SpriteMaterial } from "../../material/sprite/sprite-material";
import { QuadGeometry } from "../geometry/quad-geometry";
import { Mesh3D } from "../mesh";
import { InstancedSpriteMesh } from "./instanced-sprite";

export class SpriteMesh extends Mesh3D {

  public get spriteMaterial() {
    return this.material as SpriteMaterial;
  }

  public set origin(point: IPointData) {
    this.spriteMaterial.origin = Vec3.fromValues(point.x, point.y, 0.5);
  }
  public get origin(): IPointData {
    return new Point(this.spriteMaterial.origin[0], this.spriteMaterial.origin[1]);
  }

  public set texture(texture: Texture | undefined) {
    this.spriteMaterial.texture = texture;
  }
  public get texture(): Texture | undefined {
    return this.spriteMaterial.texture;
  }
  public constructor(texture?: Texture, material: SpriteMaterial = new SpriteMaterial()) {
    const geometry = QuadGeometry.create();
    for (let i = 0; i < geometry.positions.buffer.length; ++i) {
      geometry.positions.buffer[i] = geometry.positions.buffer[i] * 0.5;
    }
    super(QuadGeometry.create(), material);
    this.texture = texture;
  }

  /**
 * Creates a new instance of this mesh.
 */
  createInstance() {
    if (this.material && !this.material.isInstancingSupported) {
      throw new Error("PIXI3D: Can't create instance of mesh, material does not support instancing.")
    }
    const instance = new InstancedSpriteMesh(this, this.spriteMaterial.createInstance());
    this.instances.push(instance);
    return instance;
  }
}