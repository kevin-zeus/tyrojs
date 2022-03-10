/**
 * 事件处理器
 */
export default class Event {
  private _listeners: any = null

  /**
   * 绑定一个事件监听
   * @param type 事件类型
   * @param listener 事件监听回调函数
   * @param context 事件监听的触发对象
   * @param once 是否一次性监听，即回调一次后删除，不再响应
   * @returns Event
   */
  on(type: string, listener: Function, context: any, once?: boolean): Event {
    let listeners = (this._listeners = this._listeners || {});
    let eventListeners = (listeners[type] = listeners[type] || []);
    for (let i = 0, len = eventListeners.length; i < len; i++) {
      let el = eventListeners[i];
      if (el.listener === listener) return this;
    }
    eventListeners.push({
      listener,
      once: once || false,
      context,
    })
    return this;
  }

  /**
   * 绑定一个一次性事件监听
   * @param type 事件类型
   * @param listener 事件监听回调函数
   * @param context 事件监听触发对象
   * @returns Event
   */
  once(type: string, listener: Function, context: any): Event {
    return this.on(type, listener, context, true)
  }

  off(type: string, listener: Function, context: any): Event {
    if (!this._listeners) return this;
    let eventListeners = this._listeners[type]
    if (!eventListeners) return this;

    for (let i=0, len = eventListeners.length; i < len; i++) {
      let el = eventListeners[i];
      if (el.listener === listener && el.context === context) {
        eventListeners.splice(i, 1);
        if (eventListeners.length === 0) delete this._listeners[type];
        break;
      }
    }
    return this;
  }

  offEvent(type: string): Event {
    if (!this._listeners) return this;
    let eventListeners = this._listeners[type]
    if (!eventListeners) return this;
    delete this._listeners[type];
    return this;
  }

  offAll(): Event {
    if (!this._listeners) return this;
    this._listeners = null
    return this;
  }

  emit(type: string, data: any): boolean {
    if (!this._listeners) return false;

    let eventListeners = this._listeners[type];
    if (!eventListeners) return false;

    let eventListenersTemp = eventListeners.slice(0);
    for (let i=0, len = eventListenersTemp.length; i<len; i++) {
      let el = eventListenersTemp[i];
      el.listener.call(el.context, data)
      if (el.once) {
        let index = eventListeners.indexOf(el);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    }

    if (eventListeners.length === 0) delete this._listeners[type];
    return true;
  }
}