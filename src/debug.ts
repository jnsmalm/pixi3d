import * as PIXI from "pixi.js"
import { Message } from "./message"

export namespace Debug {
  const messages: Message[] = []
  const eventEmitter = new PIXI.utils.EventEmitter()

  export function on(event: string | symbol, fn: PIXI.utils.EventEmitter.ListenerFn, context: any) {
    eventEmitter.on(event, fn, context)
  }

  export function warn(message: Message) {
    if (messages.includes(message)) {
      return
    }
    messages.push(message)
    console.warn(`PIXI3D: ${message}`)
    eventEmitter.emit("warn", message)
  }

  export function error(message: Message) {
    if (messages.includes(message)) {
      return
    }
    messages.push(message)
    console.error(`PIXI3D: ${message}`)
    eventEmitter.emit("error", message)
  }
}