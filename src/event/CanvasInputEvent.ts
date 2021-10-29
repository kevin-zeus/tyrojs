import EInputEventType from "../enums/EInputEventType";

export default  class CanvasInputEvent {
  public altKey: boolean
  public ctrlKey: boolean
  public shiftKey: boolean
  public type: EInputEventType

  constructor(type: EInputEventType, altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false) {
    this.type = type;
    this.altKey = altKey;
    this.ctrlKey = ctrlKey;
    this.shiftKey = shiftKey;
  }
}
