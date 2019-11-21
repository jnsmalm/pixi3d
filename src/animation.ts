export interface Animation {
  name?: string
  update(delta: number): void
}