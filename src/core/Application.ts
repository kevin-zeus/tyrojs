import EInputEventType from "../enums/EInputEventType";
import CanvasKeyBoardEvent from "../event/CanvasKeyBoardEvent";
import CanvasMouseEvent from "../event/CanvasMouseEvent";
import Vec2 from "../math/Vec2";

export default class Application implements EventListenerObject {
  public canvas: HTMLCanvasElement
  public isSupportMouseMove: boolean

  protected _isMouseDown: boolean

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.addEventListener('mousedown', this, false);
    this.canvas.addEventListener('mouseup', this, false);
    this.canvas.addEventListener('mousemove', this, false);
    window.addEventListener('keydown', this, false);
    window.addEventListener('keyup', this, false);
    window.addEventListener('keypress', this, false);

    this._isMouseDown = false;
    this.isSupportMouseMove = false;
  }

  public handleEvent(evt: Event): void {
    switch(evt.type) {
      case 'mousedown':
        this._isMouseDown = true;
        this.dispatchMouseDown(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDOWN));
        break;
      case 'mouseup':
        this._isMouseDown = false;
        this.dispatchMouseDown(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEUP));
        break;
      case 'mousemove':
        if (this.isSupportMouseMove) {
          this.dispatchMouseMove(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEMOVE));
        }
        if (this._isMouseDown) {
          this.dispatchMouseDrag(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDRAG));
        }
        break;
      case 'keydown':
        this.dispatchKeyDown(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYDOWN));
        break;
      case 'keyup':
        this.dispatchKeyUp(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYUP));
        break;
      case 'keypress':
        this.dispatchKeyPress(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYPRESS));
        break;
      default:
        return;
    }
  }

  public start(): void {}

  public stop(): void {}

  public render(): void {}

  public showFPS(show: boolean): void {}

  private _toCanvasMouseEvent(evt: Event, type: EInputEventType): CanvasMouseEvent {
    let event: MouseEvent = evt as MouseEvent;
    let mousePosition: Vec2 = this._viewportToCanvasCoordinate(event);
    return new CanvasMouseEvent(type, mousePosition, event.button, event.altKey, event.ctrlKey, event.shiftKey);
  }

  private _toCanvasKeyBoardEvent(evt: Event, type: EInputEventType): CanvasKeyBoardEvent {
    let event: KeyboardEvent = evt as KeyboardEvent;
    return new CanvasKeyBoardEvent(type, event.key, event.keyCode, event.repeat, event.altKey, event.ctrlKey, event.shiftKey);
  }

  /**
   * 将鼠标在视窗的坐标转换为Canvas坐标系下的坐标值
   * @param evt 鼠标事件
   * @returns Canvas坐标系下的鼠标事件坐标
   */
  private _viewportToCanvasCoordinate(evt: MouseEvent): Vec2 {
    if (!this.canvas) {
      throw new Error('canvas 不存在');
    }

    let rect: DOMRect = this.canvas.getBoundingClientRect();
    const x: number = evt.clientX - rect.left;
    const y: number = evt.clientY - rect.top;
    return Vec2.create(x, y);
  }
  
  protected dispatchMouseDown(evt: CanvasMouseEvent): void {}
  protected dispatchMouseUp(evt: CanvasMouseEvent): void {} 
  protected dispatchMouseMove(evt: CanvasMouseEvent): void {}
  protected dispatchMouseDrag(evt: CanvasMouseEvent): void {}
  protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {}
  protected dispatchKeyUp(evt: CanvasKeyBoardEvent): void {}
  protected dispatchKeyPress(evt: CanvasKeyBoardEvent): void {}
}