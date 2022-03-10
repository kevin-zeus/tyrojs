import Matrix2d from "../math/Matrix2d";
import Vector2d from "../math/Vector2d";
import Polygon from "../shapes/Polygon";
import Pool from "../utils/Pool";

interface IPos {
  x: number
  y: number
}

class Bounds {
  static EMPTY: Bounds = new Bounds();
  public min: IPos = { x: Infinity, y: Infinity }; // 左上角的点
  public max: IPos = { x: -Infinity, y: -Infinity }; // 右下角的点

  private _center: Vector2d = Vector2d.EMPTY;

  constructor() {
    this.reset();
  }
  
  static create(): Bounds {
    return Pool.getItemByClass('Bounds', Bounds);
  }

  reset(): Bounds {
    this.setMinMax(Infinity, Infinity, -Infinity, -Infinity);
    return this;
  }

  set(vertices?: Vector2d[]): Bounds {
    this.reset();
    if (typeof vertices !== 'undefined') {
      this.update(vertices);
    }
    return this;
  }

  setMinMax(minX: number, minY: number, maxX: number, maxY: number) {
    this.min.x = minX;
    this.min.y = minY;

    this.max.x = maxX;
    this.max.y = maxY;
  }

  get x(): number {
    return this.min.x;
  }

  set x(val) {
    let deltaX = this.max.x - this.min.x;
    this.min.x = val;
    this.max.x = val + deltaX;
  }

  get y(): number {
    return this.min.y;
  }

  set y(val) {
    let deltaY = this.max.y - this.min.y;
    this.min.y = val;
    this.max.y = val + deltaY;
  }

  get width(): number {
    return this.max.x - this.min.x;
  }

  set width(val) {
    this.max.x = this.min.x + val;
  }

  get height(): number {
    return this.max.y - this.min.y;
  }

  set height(val) {
    this.max.y = this.min.y + val;
  }

  get left(): number {
    return this.min.x;
  }

  get right(): number {
    return this.max.x;
  }

  get top(): number {
    return this.min.y;
  }

  get bottom(): number {
    return this.max.y;
  }

  get centerX(): number {
    return this.min.x + (this.width / 2);
  }

  get centerY(): number {
    return this.min.y + (this.height / 2);
  }

  get center(): Vector2d {
    this._center === Vector2d.EMPTY && (this._center = Vector2d.create())
    return this._center.set(this.centerX, this.centerY);
  }

  update(vertices: Vector2d[]) {
    this.add(vertices, true);
  }

  add(vertices: Vector2d[], clear: boolean = false) {
    if (clear === true) {
      this.reset();
    }
    for (let i=0; i < vertices.length; i++) {
      let vertex = vertices[i];
      if (vertex.x > this.max.x) this.max.x = vertex.x;
      if (vertex.x < this.min.x) this.min.x = vertex.x;
      if (vertex.y > this.max.y) this.max.y = vertex.y;
      if (vertex.y < this.min.y) this.min.y = vertex.y;
    }
  }

  addBounds(bounds: Bounds, clear: boolean = false) {
    if (clear === true) {
      this.reset();
    }

    if (bounds.max.x > this.max.x) this.max.x = bounds.max.x;
    if (bounds.min.x < this.min.x) this.min.x = bounds.min.x;
    if (bounds.max.y > this.max.y) this.max.y = bounds.max.y;
    if (bounds.min.y < this.min.y) this.min.y = bounds.min.y;
  }

  addPoint(v: Vector2d, m: Matrix2d) {
    if (m instanceof Matrix2d) {
      v = m.apply(v);
    }
    this.min.x = Math.min(this.min.x, v.x);
    this.max.x = Math.max(this.max.x, v.x);
    this.min.y = Math.min(this.min.y, v.y);
    this.max.y = Math.max(this.max.y, v.y);
  }

  /**
   * 是否包含目标点或盒子
   * @param x number-点x坐标，Vector2d-点坐标，Bounds-目标盒子
   * @param y 可选，当x为Vector2d或Bounds的时候可选
   * @returns 
   */
  contains(x: number|Vector2d|Bounds, y?: number): boolean {
    let _x1: number, _x2: number, _y1: number, _y2: number;
    if (typeof x === 'number' && typeof y === 'number') {
      _x1 = _x2 = x;
      _y1 = _y2 = y;
    }
    else if (x instanceof Bounds) {
      _x1 = x.min.x;
      _x2 = x.max.x;
      _y1 = x.min.y;
      _y2 = x.max.y;
    }
    else if (x instanceof Vector2d) {
      _x1 = _x2 = x.x;
      _y1 = _y2 = x.y;
    } else {
      throw new Error('contains function params error.')
    }

    return _x1 >= this.min.x && _x2 <= this.max.x
      && _y1 >= this.min.y && _y2 <= this.max.y;
  }

  /**
   * 是否与目标盒子重叠
   * @param bounds 目标盒子
   * @returns 
   */
  overlaps(bounds: Bounds): boolean {
    return !(this.right < bounds.left || this.left > bounds.right ||
      this.bottom < bounds.top || this.top > bounds.bottom);
  }

  /**
   * 判断包围盒是否在有限值内
   * @returns 
   */
  isFinite(): boolean {
    return (isFinite(this.min.x) && isFinite(this.max.x) && isFinite(this.min.y) && isFinite(this.max.y));
  }

  translate(x: number|Vector2d, y?: number) {
    let _x: number, _y: number;

    if (typeof x === 'number' && typeof y === 'number') {
      _x = x;
      _y = y;
    } else if (x instanceof Vector2d) {
      _x = x.x;
      _y = x.y;
    } else {
      throw new Error('translate function params error.')
    }

    this.min.x += _x;
    this.max.x += _x;
    this.min.y += _y;
    this.max.y += _y;
  }

  translateTo(x: number|Vector2d, y?: number) {
    let _x: number, _y: number;

    if (typeof x === 'number' && typeof y === 'number') {
      _x = x;
      _y = y;
    } else if (x instanceof Vector2d) {
      _x = x.x;
      _y = x.y;
    } else {
      throw new Error('translate function params error.')
    }

    let deltaX = this.max.x - this.min.x,
            deltaY = this.max.y - this.min.y;

    this.min.x = _x;
    this.max.x = _x + deltaX;
    this.min.y = _y;
    this.max.y = _y + deltaY;
  }

  clone() {
    return Bounds.create().addBounds(this)
  }

  toPolygon() {
    return Polygon.create().set(this.x, this.y, [
      Vector2d.create().set(0, 0),
      Vector2d.create().set(this.width, 0),
      Vector2d.create().set(this.width, this.height),
      Vector2d.create().set(0, this.height),
    ])
  }
}

export default Bounds;
