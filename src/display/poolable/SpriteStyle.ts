import Pool from "../../utils/Pool";

export default class SpriteStyle {
  static EMPTY: SpriteStyle = new SpriteStyle();
  scaleX: number = 1;
  scaleY: number = 1;
  skewX: number = 0;
  skewY: number = 0;
  anchorX: number = 0;
  anchorY: number = 0;
  alpha: number = 1;
  rotation: number = 0;
  hitArea: any = null;
  blenMode: string|null = null;

  constructor() {
    this.reset();
  }
  
  /**
   * 重置，方便下次复用
   * @returns 重置之后的 SpriteStyle
   */
  reset(): SpriteStyle {
    this.scaleX = this.scaleY = 1;
    this.skewX = this.skewY = 0;
    this.anchorX = this.anchorY = 0;
    this.rotation = 0;
    this.alpha = 1;
    this.hitArea = null;
    this.blenMode = null;
    return this;
  }

  /**
   * 回收
   */
  recover(): void {
    if (this === SpriteStyle.EMPTY) return;
    Pool.recover('SpriteStyle', this.reset());
  }

  static create(): SpriteStyle {
    return Pool.getItemByClass('SpriteStyle', SpriteStyle);
  }
}