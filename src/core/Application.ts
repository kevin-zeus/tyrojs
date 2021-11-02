import EInputEventType from "../enums/EInputEventType";
import CanvasKeyBoardEvent from "../event/CanvasKeyBoardEvent";
import CanvasMouseEvent from "../event/CanvasMouseEvent";
import Vec2 from "../math/Vec2";

export default class Application implements EventListenerObject {
  public canvas: HTMLCanvasElement
  public isSupportMouseMove: boolean

  protected _isMouseDown: boolean
  protected _start: boolean = false
  protected _requestId: number = -1
  protected _lastTime!: number
  protected _startTime!: number

  private _fps: number = 0

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

  public isRunning(): boolean {
    return this._start;
  }

  public get fps(): number {
    return this._fps;
  }

  public handleEvent(evt: Event): void {
    switch(evt.type) {
      case 'mousedown':
        this._isMouseDown = true;
        this.dispatchMouseDown(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDOWN));
        break;
      case 'mouseup':
        this._isMouseDown = false;
        this.dispatchMouseUp(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEUP));
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

  public start(): void {
    if (!this._start) {
      this._start = true;
      this._lastTime = -1;
      this._startTime = -1;
      this._requestId = requestAnimationFrame((msec: number): void => {
        this.step(msec);
      })
    }
  }

  protected step(timeStamp: number): void {
    if (this._startTime === -1) this._startTime = timeStamp;
    if (this._lastTime === -1) this._lastTime = timeStamp;
    let elapsedMsec = timeStamp - this._startTime;
    let intervalSec = timeStamp - this._lastTime;
    if (intervalSec !== 0) {
      this._fps = 1000.0 / intervalSec;
    }
    intervalSec /= 1000.0;
    this._lastTime = timeStamp;
    this.update(elapsedMsec, intervalSec);
    this.render();
    requestAnimationFrame((elapsedMsec: number): void => {
      this.step(elapsedMsec);
    })
  }

  public stop(): void {}

  public update(elapsedMsec: number, intervalSec: number): void {}

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
    if (!evt.target) {
      throw new Error('evt.target 为null');
    }

    let rect: DOMRect = this.canvas.getBoundingClientRect();
    let borderLeftWidth: number = 0;
    let borderTopWidth: number = 0;
    let paddingLeft: number = 0;
    let paddingTop: number = 0;
    let decl: CSSStyleDeclaration = window.getComputedStyle(evt.target as HTMLElement);

    let strNumber: string|null = decl.borderLeftWidth;
    if (strNumber !== null) {
      borderLeftWidth = parseInt(strNumber, 10);
    }
    strNumber = decl.borderTopWidth;
    if (strNumber !== null) {
      borderTopWidth = parseInt(strNumber, 10);
    }
    strNumber = decl.paddingLeft;
    if (strNumber !== null) {
      paddingLeft = parseInt(strNumber, 10);
    }
    strNumber = decl.paddingTop;
    if (strNumber !== null) {
      paddingTop = parseInt(strNumber, 10);
    }

    console.log('当前Canvas的rect', rect);
    console.log(this.canvas.width);
    console.log(this.canvas.height);
    const x: number = evt.clientX - rect.left - borderLeftWidth - paddingLeft;
    const y: number = evt.clientY - rect.top - borderTopWidth - paddingTop;
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