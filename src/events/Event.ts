export default class Event {
  /** 空 Event 对象，用于事件派发中转使用 */
  static EMPTY: Event = new Event();
  /** 定义 mousedown 事件对象的 type 属性 */
  static MOUSE_DOWN: string = 'mousedown';
  static MOUSE_UP: string = 'mouseup';
  static CLICK: string = 'click';
  static MOUSE_MOVE: string = 'mousemove';
  static ENTER_FRAME: string = 'enterframe';
  static VISIBILITY_CHANGE: string = 'visibilitychange';

  type: string;
}