namespace tyro {
  let callbacks: IEventCallbacks = {};

  /**
   * 监听某个事件
   * @param {String} event 事件名
   * @param {Function} callback 回调方法
   * @param {Boolean} once 是否一次性事件
   */
  export function on(event: string, callback: Function, once?: boolean): void {
    callbacks[event] = callbacks[event] || [];
    callbacks[event].push({
      once: !!once,
      cb: callback,
    });
  }

  /**
   * 注销监听某个事件
   * 当没有事件名时，会注销掉所有的事件
   * 当只有事件名，没有回调函数时，会注销该事件名下的所有函数
   * @param {String} event 事件名
   * @param {Function} callback 事件回调
   */
  export function off(event?: string, callback?: Function): void {
    // TODO: 无参数，则清空所有的非系统事件
    if (arguments.length === 0) {
      callbacks = {};
      return;
    }

    if (event) {
      // TODO: 无具体事件回调，则清空该事件名下的所有事件
      if (!callback) {
        callbacks[event] = []
        return;
      }

      // 否则清空具名事件
      callbacks[event] = (callbacks[event] || []).filter((e: TEvent) => e.cb !== callback);
    }
  }

  export function emit(event: string, ...args: any[]): void {
    const eventCallbacks: TEvent[] = (callbacks[event] || []).slice();
    eventCallbacks.forEach((e: TEvent) => {
      e.cb(...args);
      if (e.once) off(event, e.cb);
    })
  }

  type TEvent = {
    once: boolean
    cb: Function
  }

  interface IEventCallbacks {
    [key: string]: TEvent[]
  }

  /// 引擎自定义事件枚举
  enum SYSTEM_EVENT {
    'assetsLoaded',
  }
}
