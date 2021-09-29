export enum LightType {
  /**
   * A light that is located at a point and emits light in a cone shape.
   */
  spot = "spot",

  /**
   * A light that is located infinitely far away, and emits light in one 
   * direction only.
   */
  directional = "directional",

  /** 
   * A light that is located at a point and emits light in all directions 
   * equally.
   */
  point = "point"
}