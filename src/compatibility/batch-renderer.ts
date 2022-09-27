import * as PixiCore from "@pixi/core"
import { CompatibilityAccess } from "./compatibility-access"

export const BatchRenderer: typeof PixiCore.AbstractBatchRenderer =
  CompatibilityAccess.get(PixiCore, "BatchRenderer") ||
  //@ts-ignore 
  CompatibilityAccess.get(PixiCore, "AbstractBatchRenderer")