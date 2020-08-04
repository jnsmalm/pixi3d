export enum StandardMaterialAlphaMode {
  /**
   * The rendered output is fully opaque and any alpha value is ignored.
   */
  opaque = "opaque",
  /**
   * The rendered output is either fully opaque or fully transparent depending 
   * on the alpha value and the specified alpha cutoff value. This mode is used 
   * to simulate geometry such as tree leaves or wire fences.
   */
  mask = "mask",
  /**
   * The rendered output is combined with the background using the normal 
   * painting operation (i.e. the Porter and Duff over operator). This mode is 
   * used to simulate geometry such as guaze cloth or animal fur.
   */
  blend = "blend"
}