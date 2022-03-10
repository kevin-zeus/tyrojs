import Vector2d from "./Vector2d";
import Pool from "../utils/Pool";

/**
 * 2d 矩阵计算类
 * @class Matrix2d
 */
class Matrix2d {
  static EMPTY: Matrix2d = new Matrix2d();
  public val: Float32Array = new Float32Array(9);

    /**
   * 构造一个变换矩阵
   * @param a m00
   * @param b m10
   * @param c m20
   * @param d m01
   * @param e m11
   * @param f m21
   * @param g m02
   * @param h m12
   * @param i m22
   * @returns 
   */
  constructor() {
    this.reset()
  }

  reset(): Matrix2d {
    this.val = new Float32Array(9);
    return this;
  }

    /**
   * 初始化，设置值，可在 pool 中使用
   * @param a m00或矩阵，当a变量为矩阵时，其他值为空，则直接copy改矩阵
   * @param b m10
   * @param c m20
   * @param d m01
   * @param e m11
   * @param f m21
   * @param g m02
   * @param h m12
   * @param i m22
   * @returns this
   */
  set(
    a: number|Matrix2d, b?: number, c?: number,
    d?: number, e?: number, f?: number,
    g?: number, h?: number, i?: number,
  ): Matrix2d {
    if (a instanceof Matrix2d) {
      this.copy(a);
    }
    else if (
      typeof b === 'number'
      && typeof c === 'number'
      && typeof d === 'number'
      && typeof e === 'number'
      && typeof f === 'number'
    ) {
      this.setTransform(
        a, b, c,
        d, e, f,
        g, h, i
      )
    }
    return this;
  }

  /**
   * 将变换矩阵重置为单位矩阵
   * @returns 
   */
  identity() {
    this.setTransform(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    );
    return this;
  }

  /**
   * 设置变换矩阵的值
   * @param a m00
   * @param b m10
   * @param c m20
   * @param d m01
   * @param e m11
   * @param f m21
   * @param g m02
   * @param h m12
   * @param i m22
   * @returns 
   */
  setTransform(
    a: number, b: number, c: number,
    d: number, e: number, f: number,
    g?: number, h?: number, i?: number,
  ) {
    let val = this.val;
    val[0] = a;
    val[1] = b;
    val[2] = c;
    val[3] = d;
    val[4] = e;
    val[5] = f;
    val[6] = g || 0;
    val[7] = h || 0;
    val[8] = i || 1;
    return this;
  }

  copy(m: Matrix2d) {
    this.val.set(m.val);
    return this;
  }

  /**
   * 矩阵相乘
   * @param m 目标矩阵
   */
  multiply(m: Matrix2d): Matrix2d {
    let b = m.val,
        a = this.val,
        a0 = a[0],
        a1 = a[1],
        a3 = a[3],
        a4 = a[4],
        b0 = b[0],
        b1 = b[1],
        b3 = b[3],
        b4 = b[4],
        b6 = b[6],
        b7 = b[7];
    
    a[0] = a0 * b0 + a3 * b1;
    a[1] = a1 * b0 + a4 * b1;
    a[3] = a0 * b3 + a3 * b4;
    a[4] = a1 * b3 + a4 * b4;
    a[6] += a0 * b6 + a3 * b7;
    a[7] += a1 * b6 + a4 * b7;

    return this;
  }

  /**
   * 矩阵转置
   */
  transpose(): Matrix2d {
    let a = this.val,
        a1 = a[1],
        a2 = a[2],
        a5 = a[5];

    a[1] = a[3];
    a[2] = a[6];
    a[3] = a1;
    a[5] = a[7];
    a[6] = a2;
    a[7] = a5;

    return this;
  }

  /**
   * 转为逆矩阵
   */
  invert(): Matrix2d {
    let val = this.val;

    let a = val[ 0 ], b = val[ 1 ], c = val[ 2 ],
        d = val[ 3 ], e = val[ 4 ], f = val[ 5 ],
        g = val[ 6 ], h = val[ 7 ], i = val[ 8 ];

    let ta = i * e - f * h,
        td = f * g - i * d,
        tg = h * d - e * g;

    let n = a * ta + b * td + c * tg;

    val[ 0 ] = ta / n;
    val[ 1 ] = ( c * h - i * b ) / n;
    val[ 2 ] = ( f * b - c * e ) / n;

    val[ 3 ] = td / n;
    val[ 4 ] = ( i * a - c * g ) / n;
    val[ 5 ] = ( c * d - f * a ) / n;

    val[ 6 ] = tg / n;
    val[ 7 ] = ( b * g - h * a ) / n;
    val[ 8 ] = ( e * a - b * d ) / n;

    return this;
  }

  /**
   * 将当前矩阵变换应用到目标向量
   * @param v 目标向量
   * @returns 
   */
  apply(v: Vector2d): Vector2d {
    let a = this.val,
        x = v.x,
        y = v.y;

    v.x = x * a[0] + y * a[3] + a[6];
    v.y = x * a[1] + y * a[4] + a[7];

    return v;
  }

  /**
   * 将反转矩阵变换应用到目标向量
   * @param v 目标向量
   * @returns 
   */
  applyInverse(v: Vector2d): Vector2d {
    let a = this.val,
        x = v.x,
        y = v.y;

    let invD = 1 / ((a[0] * a[4]) + (a[3] * -a[1]));

    v.x = (a[4] * invD * x) + (-a[3] * invD * y) + (((a[7] * a[3]) - (a[6] * a[4])) * invD);
    v.y = (a[0] * invD * y) + (-a[1] * invD * x) + (((-a[7] * a[0]) + (a[6] * a[1])) * invD);

    return v;
  }

  /**
   * 矩阵缩放
   * @param x x轴缩放值
   * @param y 可选，不存在时采用x轴
   * @returns 
   */
  scale(x: number, y?: number): Matrix2d {
    let a = this.val,
        _x = x,
        _y = typeof(y) === "undefined" ? _x : y;

    a[0] *= _x;
    a[1] *= _x;
    a[3] *= _y;
    a[4] *= _y;

    return this;
  }
  scaleByVector(v: Vector2d): Matrix2d {
    return this.scale(v.x, v.y);
  }
  scaleX(x: number): Matrix2d {
    return this.scale(x, 1);
  }
  scaleY(y: number): Matrix2d {
    return this.scale(1, y);
  }

  /**
   * 矩阵旋转
   * @param angle 旋转角度（弧度单位）
   * @returns 
   */
  rotate(angle: number): Matrix2d {
    if (angle !== 0) {
      let a = this.val,
          a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a10 = a[3],
          a11 = a[4],
          a12 = a[5],
          s = Math.sin(angle),
          c = Math.cos(angle);

      a[0] = c * a00 + s * a10;
      a[1] = c * a01 + s * a11;
      a[2] = c * a02 + s * a12;

      a[3] = c * a10 - s * a00;
      a[4] = c * a11 - s * a01;
      a[5] = c * a12 - s * a02;
    }
    return this;
  }

  /**
   * 平移矩阵
   * @param x x轴位移，若为Vector2d，则直接参照向量位移
   * @param y 可选，y轴位移距离
   * @returns 
   */
  translate(x: number|Vector2d, y?: number): Matrix2d {
    let a = this.val;
    let _x, _y;

    if (typeof x === 'object' && x instanceof Vector2d) {
      _x = x.x;
      _y = x.y;
    }
    if (typeof x === 'number' && typeof y === 'number') {
      _x = x;
      _y = y;
    }

    a[6] += a[0] * (_x as number) + a[3] * (_y as number);
    a[7] += a[1] * (_x as number) + a[4] * (_y as number);

    return this;
  }

  /**
   * 是否是单位矩阵
   * @returns 
   */
  isIdentity(): boolean {
    let a = this.val;

    return (
        a[0] === 1 &&
        a[1] === 0 &&
        a[2] === 0 &&
        a[3] === 0 &&
        a[4] === 1 &&
        a[5] === 0 &&
        a[6] === 0 &&
        a[7] === 0 &&
        a[8] === 1
    );
}

  /**
   * 是否相等于目标矩阵
   * @param m 目标矩阵
   * @returns 
   */
  equals(m: Matrix2d): boolean {
    let b = m.val;
    let a = this.val;

    return (
        (a[0] === b[0]) &&
        (a[1] === b[1]) &&
        (a[2] === b[2]) &&
        (a[3] === b[3]) &&
        (a[4] === b[4]) &&
        (a[5] === b[5]) &&
        (a[6] === b[6]) &&
        (a[7] === b[7]) &&
        (a[8] === b[8])
    );
  }

  static create(): Matrix2d {
    return Pool.getItemByClass('Matrix2d', Matrix2d);
  }

  clone(): Matrix2d {
    return Matrix2d.create().set(
      this.val[0], this.val[1], this.val[2],
      this.val[3], this.val[4], this.val[5],
      this.val[6], this.val[7], this.val[8],
    )
  }

  recover(): void {
    if (this === Matrix2d.EMPTY) return;
    Pool.recover('Matrix2d', this.reset())
  }

  toArray(): Float32Array {
    return this.val;
  }

  toString(): string {
    let a = this.val;
    return `
      ${a[0]}, ${a[1]}, ${a[2]},\n
      ${a[3]}, ${a[4]}, ${a[5]},\n
      ${a[6]}, ${a[7]}, ${a[8]},\n
    `;
  }
}

export default Matrix2d;
