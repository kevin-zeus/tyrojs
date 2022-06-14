export class String {
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
}
