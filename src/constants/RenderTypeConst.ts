export default class RenderTypeConst {
  /** 不渲染 */
  static NONE: number = 0;
  /** 透明度 */
  static ALPHA: number = 0x01;
  /** 矩阵变换 */
  static TRANSFORM: number = 0x02;
  /** 混合效果 */
  static BLEND: number = 0x04;
  /** 画布渲染 */
  static CANVAS: number = 0x08;
  /** 过滤效果 */
  static FILTERS: number = 0x10;
  /** 遮罩效果 */
  static MASK: number = 0x20;
  /** 裁剪效果 */
  static CLIP: number = 0x40;
  /** 纹理渲染 */
  static TEXTURE: number = 0x80;
}
