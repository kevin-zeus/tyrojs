<<<<<<< HEAD
export class Utils {
  private static _pi: number = 180 / Math.PI;

=======
/**
 * 工具类 Utils
 */
export class Utils {
>>>>>>> f8c4309d1f37222f85bb3260d3f4264ff3ec5ab7
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

<<<<<<< HEAD
=======

>>>>>>> f8c4309d1f37222f85bb3260d3f4264ff3ec5ab7
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
<<<<<<< HEAD
=======

  /**
   * 判断给定字符串是否是浮点或整型数字
   * @param str 给定的字符串
   * @returns 
   */
  static isNumberic(str: string): boolean {
    let trimedStr = str.trim();
    return !isNaN(Number(trimedStr)) && /[+-]?([0-9]*[.])?[0-9]+/.test(trimedStr);
  }

  /**
   * 判断给定字符串是不是true或false
   * @param str 给定的字符串
   * @returns 
   */
  static isBoolean(str: string): boolean {
    let trimedStr = str.trim();
    return (trimedStr === 'true') || (trimedStr === 'false');
  }

  /**
   * 将字符串转换为对应16进制值
   * @param str 给定的字符串
   * @returns 
   */
  static toHex(str: string): string {
    let res: string = '', c: number = 0;
    while (c < str.length) {
      res += str.charCodeAt(c++).toString(16);
    }
    return res;
  }
>>>>>>> f8c4309d1f37222f85bb3260d3f4264ff3ec5ab7
}
