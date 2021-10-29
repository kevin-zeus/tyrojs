import CanvasInputEvent from "./CanvasInputEvent";
import EInputEventType from "../enums/EInputEventType";

export default class CanvasKeyBoardEvent extends CanvasInputEvent {
  public key: string
  public keyCode: number
  public repeat: boolean

  constructor(
    type: EInputEventType, key: string, keyCode: number, repeat: boolean,
    altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false
  ) {
    super(type, altKey, ctrlKey, shiftKey);
    this.key = key;
    this.keyCode = keyCode;
    this.repeat = repeat;
  }
}