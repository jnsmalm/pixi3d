import * as PixiCore from "@pixi/core"

export namespace PixiVersion {
  export function isLaterThan6() {
    // @ts-ignore
    return PixiCore["ArrayResource" + ""] !== undefined
  }
}