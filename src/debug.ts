import * as PIXI from "pixi.js"
import { Message } from "./message"

export namespace Debug {
  const messages: Message[] = []
  const eventEmitter = new PIXI.utils.EventEmitter()

  export function on(event: string | symbol, fn: PIXI.utils.EventEmitter.ListenerFn, context: any) {
    eventEmitter.on(event, fn, context)
  }

  export function warn(message: Message, args?: any) {
    if (!messages.includes(message)) {
      messages.push(message)
      let formatted = formatMessage(message, args)
      console.warn(`PIXI3D: ${formatted}`)
      eventEmitter.emit("warn", formatted)
    }
  }

  export function error(message: Message, args?: any) {
    if (!messages.includes(message)) {
      messages.push(message)
      let formatted = formatMessage(message, args)
      console.error(`PIXI3D: ${formatted}`)
      eventEmitter.emit("error", formatted)
    }
  }

  function formatMessage(message: Message, args?: any) {
    let formatted = <string>message
    let match: RegExpExecArray | null
    while ((match = /{(\w*)}/g.exec(formatted)) !== null && args) {
      formatted = formatted.replace(match[0], args[match[1]])
    }
    return formatted
  }
}