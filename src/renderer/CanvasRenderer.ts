import Node from "../display/Node";
import Stage from "../display/Stage";
import Renderer from "./Renderer";

export default class CanvasRenderer extends Renderer {
  renderType: string = 'canvas'
  context: CanvasRenderingContext2D

  constructor() {
    super()
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
  }

  startDraw(target: Node): boolean {
    if (target.visible && target.alpha > 0) {
      if (target === this.stage) {
        this.context.clearRect(0, 0, target.width, target.height);
      }
      if (target.blendMode !== this.blendMode) {
        this.context.globalCompositeOperation =  this.blendMode = target.blendMode as GlobalCompositeOperation;
      }
      this.context.save()
      return true;
    }
    return false;
  }

  draw(target: Node): void {
    let ctx = this.context, w = target.width, h = target.height;

    // 画背景
    let bg = target.background;
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
    }

    // 画图片
    let drawable = target.drawable, image = drawable && drawable.image;
    if (image) {
      let rect = drawable.rect,
        sw = rect[2],
        sh = rect[3],
        offsetX = rect[4],
        offsetY = rect[5];
      if (!sw || !sh) {
        return;
      }
      if (!w && !h) {
        w = target.width = sw;
        h = target.height = sh;
      }
      if (offsetX || offsetY) ctx.translate(offsetX - sw * 0.5, offsetY - sh * 0.5);
      ctx.drawImage(image, rect[0], rect[1], sw, sh, 0, 0, w, h);
    }
  }

  endDraw(target: Node): void {
    this.context.restore()
  }

  transform(target: Node): void {
    let drawable = target.drawable;
    if (drawable && drawable.domElement) {
      // TODO:
    }

    let ctx = this.context,
      scaleX = target.scaleX,
      scaleY = target.scaleY,
      canvas = this.canvas as HTMLCanvasElement;

    if (target === this.stage) {
      let style = canvas.style,
        oldScaleX = target;
    }
  }

  remove(target: Node): void {
    let drawable = target.drawable;
    let elem = drawable && drawable.domElement;

    if (elem) {
      let parentElm = elem.parentNode;
      if (parentElm) {
        parentElm.removeChild(elem);
      }
    }
  }

  clear(x: number, y: number, width: number, height: number): void {
    this.context.clearRect(x, y, width, height);
  }

  resize(width: number, height: number): void {
    let canvas = this.canvas as HTMLCanvasElement,
      stage = this.stage as Stage,
      style = canvas.style;

    canvas.width = width;
    canvas.height = height;

    style.width = stage.width * stage.scaleX + 'px';
    style.height = stage.height * stage.scaleY + 'px';
  }
}