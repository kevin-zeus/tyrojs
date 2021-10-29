import Application from "./Application";

export default class Canvas2DApplication extends Application {
  public context: CanvasRenderingContext2D|null;

  constructor(canvas: HTMLCanvasElement, contextSetting?: CanvasRenderingContext2DSettings) {
    super(canvas);
    this.context = this.canvas.getContext('2d', contextSetting);
  }
}