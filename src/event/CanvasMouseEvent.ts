import CanvasInputEvent from "./CanvasInputEvent";
import EInputEventType from "../enums/EInputEventType";
import Vec2 from "../math/Vec2";

export default class CanvasMouseEvent extends CanvasInputEvent {
  public button: number
  public canvasPosition: Vec2
  public localPosition: Vec2

  constructor(
    type: EInputEventType, canvasPos: Vec2, button: number,
    altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false
  ) {
    super(type, altKey, ctrlKey, shiftKey);
    this.canvasPosition = canvasPos;
    this.button = button;
    this.localPosition = new Vec2();
  }
}