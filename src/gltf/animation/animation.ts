import { Animation } from "../../animation"
import { glTFAnimationChannel } from "./animation-channel"

export enum glTFAnimationInterpolation {
  linear = "LINEAR",
  step = "STEP",
  cubicspline = "CUBICSPLINE"
}

export class glTFAnimation implements Animation {
  channels: glTFAnimationChannel[] = []

  constructor(public name?: string) {
  }

  update(delta: number): void {
    for (let channel of this.channels) {
      channel.update(delta)
    }
  }
}