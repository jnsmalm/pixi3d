import * as PixiCore from "@pixi/core"
import { CompatibilityAccess } from "./compatibility-access"

export const ArrayResource: typeof PixiCore.ArrayResource =
  CompatibilityAccess.get(PixiCore, "ArrayResource") ||
  //@ts-ignore 
  CompatibilityAccess.get(PixiCore, "resources").ArrayResource