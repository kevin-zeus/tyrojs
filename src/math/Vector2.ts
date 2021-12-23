import { clamp } from './math';

class Vector2 {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number) {
    this.onResetEvent(x, y);
  }

  onResetEvent(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  set(x: number, y: number): Vector2 {
    return this._set(x, y);
  }

  setZero(): Vector2 {
    return this.set(0, 0);
  }

  setV(v: Vector2): Vector2 {
    return this._set(v.x, v.y);
  }

  add(v: Vector2): Vector2 {
    return this._set(this.x + v.x, this.y + v.y);
  }

  sub(v: Vector2): Vector2 {
    return this._set(this.x - v.x, this.y - v.y);
  }

  scale(x: number, y?: number): Vector2 {
    return this._set(this.x * x, this.y * (typeof y !== 'undefined' ? y : x));
  }

  toIso() {

  }

  /**
   * 将向量转为2d坐标
   * @returns 
   */
  to2d(): Vector2 {
    return this._set(this.y + this.x / 2, this.y - this.x / 2);
  }

  scaleV(v: Vector2): Vector2 {
    return this._set(this.x * v.x, this.y * v.y);
  }

  /**
   * 向量除以某个值
   * @param n 值
   * @returns 
   */
  div(n: number): Vector2 {
    return this._set(this.x / n, this.y / n);
  }

  /**
   * 绝对值化向量
   * @returns 
   */
  abs(): Vector2 {
    return this._set((this.x < 0) ? -this.x : this.x, (this.y < 0) ? -this.y : this.y);
  }

  /**
   * 获取一个新的锁定在范围内的向量
   * @param low 最小值
   * @param high 最大值
   * @returns 
   */
  clamp(low: number, high: number): Vector2 {
    return new Vector2(clamp(this.x, low, high), clamp(this.y, low, high));
  }

  /**
   * 将本向量锁定在范围内
   * @param low 最小值
   * @param high 最大值
   * @returns
   */
  clampSelf(low: number, high: number): Vector2 {
    return this._set(clamp(this.x, low, high), clamp(this.y, low, high))
  }

  /**
   * 比较向量，并将本向量更新为最小的那个
   * @param v 比较的向量
   * @returns 
   */
  minV(v: Vector2): Vector2 {
    return this._set((this.x < v.x) ? this.x : v.x, (this.y < v.y) ? this.y : v.y);
  }

  /**
   * 比较向量，并将本向量更新为最大的那个
   * @param v 比较的向量
   * @returns 
   */
  maxV(v: Vector2): Vector2 {
    return this._set((this.x > v.x) ? this.x : v.x, (this.y > v.y) ? this.y : v.y);
  }

  /**
   * 获得一个新的向下取整的向量
   * @returns 
   */
  floor(): Vector2 {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
  }

  /**
   * 向下取整本向量
   * @returns 
   */
  floorSelf(): Vector2 {
    return this._set(Math.floor(this.x), Math.floor(this.y));
  }

  private _set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }
}