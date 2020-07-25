import { Animation } from "../../animation"
import { glTFChannel } from "./gltf-channel"

/**
 * Represents an animation loaded from a glTF model.
 */
export class glTFAnimation extends Animation {
  /** Channels used by this animation. */
  channels: glTFChannel[] = []

  update(delta: number) {
    for (let channel of this.channels) { channel.update(delta) }
  }
}

