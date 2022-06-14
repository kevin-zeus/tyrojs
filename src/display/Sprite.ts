import Texture from "../res/Texture";
import Node from "./Node";
import SpriteStyle from "./poolable/SpriteStyle";

export default class Sprite extends Node {
  private _texture: Texture|null = null;

  private $spriteStyle: SpriteStyle|null = SpriteStyle.EMPTY;

  constructor(texture?: Texture) {
    super()

    if (texture) {
      this.loadTexture(texture);
    }
  }

  get texture(): Texture|null {
    return this._texture;
  }
  set texture(val: Texture|null) {
    this._texture = val;
  }

  loadTexture(texture: Texture) {
    this._texture = texture;
    // 绘制图片
  }

  destory(isDestoryChild?: boolean): void {
      super.destory(isDestoryChild);

      this.$spriteStyle && this.$spriteStyle.recover();
      this.$spriteStyle = null;
      this.texture = null;
  }
}