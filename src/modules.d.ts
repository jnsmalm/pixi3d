declare module "*.png" {
  const value: string
  export default value
}

declare module "*.vert" {
  export const Shader: { source: string }
}

declare module "*.frag" {
  export const Shader: { source: string }
}