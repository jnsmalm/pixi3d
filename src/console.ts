export namespace Console {
  let messages: string[] = []

  export function error(message: string) {
    if (messages.includes(message)) {
      return
    }
    messages.push(message)
    console.error(message)
  }
}