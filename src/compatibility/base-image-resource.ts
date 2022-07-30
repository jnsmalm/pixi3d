import * as PixiCore from "@pixi/core"
import { CompatibilityAccess } from "./compatibility-access"

export const BaseImageResource: typeof PixiCore.BaseImageResource =
  CompatibilityAccess.get(PixiCore, "BaseImageResource") ||
  //@ts-ignore 
  CompatibilityAccess.get(PixiCore, "resources").BaseImageResource