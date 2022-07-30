import * as PixiCore from "@pixi/core"
import { CompatibilityAccess } from "./compatibility-access"

export const CubeResource: typeof PixiCore.CubeResource =
  CompatibilityAccess.get(PixiCore, "CubeResource") ||
  //@ts-ignore 
  CompatibilityAccess.get(PixiCore, "resources").CubeResource