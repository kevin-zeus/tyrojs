import Polygon from './Polygon';
import Vector2d from '../math/Vector2d';
import IPoolableClass from '../constants/IPoolableClass';

export default class Rectangle extends Polygon implements IPoolableClass<Rectangle> {
  className: string = 'tyro.Rectangle';
  pool: Rectangle[] = [];

  public shapeType: string = 'Rectangle';

  /**
   * 实例化一个矩形
   * @param x 左上角顶点x坐标
   * @param y 左上角顶点y坐标
   * @param w 矩形宽度
   * @param h 矩形高度
   */
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, [
      new Vector2d(0, 0),
      new Vector2d(w, 0),
      new Vector2d(w, h),
      new Vector2d(0, h)
    ]);
  }

  // init(x: number, y: number, w: number, h: number) {
  //   this.setRectangle(x, y, w, h);
  // }

  setRectangle(x: number, y: number, w: number|Vector2d[], h: number): Rectangle {
    let points = w;

    this.pos.set(x, y);
    if (typeof w === 'number' && typeof h === 'number') {
      points = this.points;
      points[0].set(0, 0);
      points[1].set(w, 0);
      points[2].set(w, h);
      points[3].set(0, h);
    }

    this.setVertices(points as Vector2d[]);
    return this;
  }

  get left(): number {
    return this.pos.x;
  }

  get right(): number {
    let w = this.width;
    return (this.pos.x + w) || w;
  }

  get top(): number {
    return this.pos.y;
  }

  get bottom(): number {
    let h = this.height;
    return (this.pos.y + h) || h;
  }

  get width(): number {
    return this.points[2].x;
  }
  set width(val) {
    this.points[1].x = this.points[2].x = val;
    this.recalc();
    this.updateBounds();
  }

  get height(): number {
    return this.points[2].y;
  }
  set height(val) {
    this.points[2].y = this.points[3].y = val;
    this.recalc();
    this.updateBounds();
  }

  get centerX(): number {
    if (isFinite(this.width)) {
      return this.pos.x + (this.width / 2);
    } else {
      return this.width;
    }
  }
  set centerX(val) {
    this.pos.x = val - (this.width / 2);
  }

  get centerY(): number {
    if (isFinite(this.height)) {
      return this.pos.y + (this.height / 2);
    } else {
      return this.height;
    }
  }
  set centerY(val) {
    this.pos.y = val - (this.height / 2);
  }

  resize(w: number, h: number): Rectangle {
    this.width = w;
    this.height = h;
    return this;
  }

  scale(x: number, y?: number): Rectangle {
    let _x: number = x, _y: number = (y as number);
    if (typeof y === 'undefined') {
      _y = x;
    }
    this.width *= _x;
    this.height *= _y;
    return this;
  }

  clone(): Rectangle {
    return new Rectangle(this.pos.x, this.pos.y, this.width, this.height);
  }

  copy(rect: Rectangle): Rectangle {
    return this.setRectangle(rect.pos.x, rect.pos.y, rect.width, rect.height);
  }
}
