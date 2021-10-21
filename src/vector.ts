namespace tyro {
  // 兼容函数，兼容hypot方法
  if (!Math.hypot) Math.hypot = function (x, y) {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=896264#c28
    var max = 0;
    var s = 0;
    for (var i = 0; i < arguments.length; i += 1) {
      var arg = Math.abs(Number(arguments[i]));
      if (arg > max) {
        s *= (max / arg) * (max / arg);
        max = arg;
      }
      s += arg === 0 && max === 0 ? 0 : (arg / max) * (arg / max);
    }
    return max === 1 / 0 ? 1 / 0 : max * Math.sqrt(s);
  };

  export class Vector {
    x: number = 0
    y: number = 0

    /**
     * 构造函数
     * @param {Number} x x轴坐标
     * @param {Number} y y轴坐标
     */
    constructor(x: number = 0, y: number = 0) {
      this.x = x;
      this.y = y;
    }

    /**
     * 计算当前向量跟目标向量相加的新向量
     * @param {Vector} vec 目标向量
     * @returns {Vector} 新向量
     */
    add(vec: Vector): Vector {
      return new Vector(this.x + vec.x, this.y + vec.y);
    }

    /**
     * 当前向量减目标向量所得的新向量
     * @param {Vector} vec 目标向量
     * @returns {Vector} 新向量
     */
    subtract(vec: Vector): Vector {
      return new Vector(this.x - vec.x, this.y - vec.y);
    }

    /**
     * 当前向量缩放所得新向量
     * @param {Number} value 缩放值
     * @returns {Vector} 新向量
     */
    scale(value: number): Vector {
      return new Vector(this.x * value, this.y * value);
    }

    normalize(length = this.length): Vector {
      return new Vector(this.x / length, this.y / length);
    }

    get length(): number {
      return Math.hypot(this.x, this.y);
    }

    dot(vec: Vector): number {
      return this.x * vec.x + this.y * vec.y;
    }

    /**
     * 计算当前向量与目标向量之间的距离
     * @param {Vector} vec 目标向量
     * @returns {Number} 距离
     */
    distance(vec: Vector): number {
      return Math.hypot(this.x - vec.x, this.y - vec.y);
    }

    /**
     * 计算当前向量与目标向量之间的夹角，以半径为单位
     * @param {Number} vec 目标向量
     * @returns {Number} 夹角值
     */
    angle(vec: Vector): number {
      return Math.acos(this.dot(vec) / (this.length * vec.length));
    }
  }
}