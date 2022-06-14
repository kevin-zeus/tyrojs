export class Utils {
  private static _pi: number = 180 / Math.PI;

  /**
   * 推迟执行一个函数，在主栈空闲的时候执行
   * @param func 待执行的方法
   * @param ctx 执行方法的上下文
   * @param args setTimeout参数
   * @returns timeout的id
   */
  static defer(func: Function, ctx: any, ...args: any[]): number {
    return window.setTimeout(func.bind(ctx), 0.01, ...args);
  }

  /**
   * 节流函数
   * @param fn 需节流的方法
   * @param delay 节流时间
   * @param no_trailing 禁用后仍执行
   * @returns 被节流的方法
   */
  static throttle(fn: Function, delay: number, no_trailing: boolean = false) {
    let last = window.performance.now(), deferTimer: number;
    return function() {
      let now = window.performance.now();
      let elasped = now - last;
      let args = arguments;
      if (elasped < delay) {
        if (no_trailing === false) {
          clearTimeout(deferTimer);
          deferTimer = window.setTimeout(function () {
            last = now;
            return fn.apply(null, args);
          }, elasped);
        }
      } else {
        last = now;
        return fn.apply(null, args);
      }
    }
  }
}
