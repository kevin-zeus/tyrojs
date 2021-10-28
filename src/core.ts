// Canvas 元素实例
let $canvas: HTMLCanvasElement|null = null
// 2D Render上下文
let $context: CanvasRenderingContext2D|null = null

// 初始化构建
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

  emit('init');
  $canvas = canvasEle as HTMLCanvasElement;
  $context = ctx as CanvasRenderingContext2D;
}

export function getCanvas() {
  return $canvas;
}

export function getContext() {
  return $context;
}