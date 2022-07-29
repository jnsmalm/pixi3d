import { MaterialRenderSortType } from "../material-render-sort-type"
import { Color } from "../../color"
import { MaterialFactory } from "../material-factory"
import { SpriteMaterial } from "./sprite-material"
import { Texture } from "@pixi/core"

export class SpriteMaterialFactory implements MaterialFactory {
  public create(source: Texture) {
    let material = new SpriteMaterial();
    material.baseColor = Color.fromHex(0xffffffff);
    material.texture = source;
    material.renderSortType = MaterialRenderSortType.transparent;
    return material;
  }
}