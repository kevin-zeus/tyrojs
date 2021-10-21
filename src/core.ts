namespace tyro {
  export let $canvas: HTMLCanvasElement|null = null

  export let $context: CanvasRenderingContext2D|null = null

  export function init(canvas?: string|HTMLCanvasElement) {
    let canvasEle: HTMLCanvasElement|null = null;
    if (!canvas) {
      canvasEle = document.querySelector('canvas');
    }
    if (typeof canvas === 'string') {
      canvasEle = document.querySelector(canvas);
    }
    if (canvas instanceof HTMLCanvasElement) {
      canvasEle = canvas;
    }

    if (!canvasEle) {
      throw Error('必须先指定一个 Canvas 元素!');
    }

    const ctx: CanvasRenderingContext2D|null = canvasEle.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
    }

    tyro.emit('init');
    tyro.$canvas = canvasEle as HTMLCanvasElement;
    tyro.$context = ctx as CanvasRenderingContext2D;
  }
}