export default class RepainTypeConst {
  /** 不需要重绘 */
  static REPAIN_NONE: number = 0;
  /** 重绘节点 */
  static REPAIN_NODE: number = 0x01;
  /** 重绘缓存 */
  static REPAIN_CACHE: number = 0x02;
  /** 全部重绘 */
  static REPAIN_ALL: number = 0x03;
}
