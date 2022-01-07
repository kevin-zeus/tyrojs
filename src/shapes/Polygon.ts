import Vector2d from '../math/Vector2d';
import pool from '../system/pooling';
import IPoolableClass from '../constants/IPoolableClass';
import Matrix2d from '../math/Matrix2d';
import Bounds from '../physics/Bounds';

class Polygon implements IPoolableClass<Polygon> {
  className: string = 'tyro.Polygon';
  pool: Polygon[] = [];

  // 坐标
  public pos: Vector2d = new Vector2d();
  // 顶点
  public points: Vector2d[] = [];
  // 边
  public edges: Vector2d[] = [];
  // 构成多边形的三角形顶点
  public indices: Vector2d[] = [];
  // 法线
  public normals: Array<any> = [];
  public shapeType: string = 'Polygon';

  private _bounds: any;

  constructor(x: number, y: number, points: Vector2d[]|number[]) {
    this.setPolygon(x, y, points);
  }

  onResetEvent(x: number, y: number, points: Vector2d[]|number[]) {
    this.setPolygon(x, y, points)
  }

  setPolygon(x: number, y: number, points: Vector2d[]|number[]): Polygon {
    this.pos.set(x, y);
    this.setVertices(points);
    return this;
  }

  /**
   * 设置多边形的顶点数组
   * @param vertices 顶点列表
   * @returns 
   */
  setVertices(vertices: Vector2d[]|number[]): Polygon {
    if (!Array.isArray(vertices)) {
      return this;
    }

    if (!(vertices[0] instanceof Vector2d)) {
      this.points.length = 0;

      // 如果传入的是 Vector2d[]
      if (typeof vertices[0] === 'object') {
        vertices.forEach((vertice) => {
          this.points.push(new Vector2d((vertice as Vector2d).x, (vertice as Vector2d).y));
        });
      }
      // 如果是 number[]，如 [1, 2, 3, 4]
      else {
        for (let p=0; p < vertices.length; p += 2) {
          this.points.push(new Vector2d(vertices[p] as number, vertices[p + 1] as number));
        }
      }
    }

    this.recalc();
    this.updateBounds();
    return this;
  }

  /**
   * 将图形进行矩阵变换
   * @param m 变化矩阵
   * @returns 
   */
  transform(m: Matrix2d): Polygon {
    let points = this.points;
    let len = points.length;
    for (let i=0; i<len; i++) {
      m.apply(points[i]);
    }
    this.recalc();
    this.updateBounds();
    return this;
  }

  /**
   * 将图形沿着参考点旋转
   * @param angle 旋转的弧度
   * @param v 旋转的参考点
   * @returns 
   */
  rotate(angle: number, v?: Vector2d): Polygon {
    if (angle !== 0) {
      let points = this.points;
      let len = points.length;
      for (let i=0; i<len; i++) {
        points[i].rotate(angle, v);
      }
      this.recalc();
      this.updateBounds();
    }
    return this;
  }

  scale(x: number, y?: number): Polygon {
    let _x = x, _y = (typeof y === 'undefined') ? x : y;
    let points = this.points;
    let len = points.length;
    for (let i=0; i<len; i++) {
      points[i].scale(_x, _y);
    }
    this.recalc();
    this.updateBounds();
    return this;
  }
  scaleV(v: Vector2d): Polygon {
    return this.scale(v.x, v.y);
  }

  /**
   * 计算出碰撞多边形。每当改变 points、angle 或 offset的时候，必须调用这个方法
   */
  recalc() {
    let edges: Vector2d[] = this.edges;
    let normals: Vector2d[] = this.normals;
    let indices: Vector2d[] = this.indices;
    let points = this.points;
    let len = points.length;

    if (len < 3) { // 多边形顶点不能少于3
      throw new Error('Requires at less 3 points');
    }

    // 计算边和法线
    for (let i = 0; i < len; i++) {
      if (edges[i] === undefined) {
        edges[i] = new Vector2d();
      }
      edges[i].copy(points[(i + 1) % len]).sub(points[i]);

      if (normals[i] === undefined) {
        normals[i] = new Vector2d();
      }
      normals[i].copy(edges[i]).perp().normalize();
    }
    edges.length = len;
    normals.length = len;
    indices.length = 0;

    return this;
  }

  /**
   * 平移图形
   * @param x x轴平移距离，若为 Vector2d，表示根据该向量平移
   * @param y 可选，y轴平移距离
   * @returns 
   */
  translate(x: number|Vector2d, y?: number) {
    let _x, _y;

    if (typeof x === 'object' && x instanceof Vector2d) {
      _x = x.x;
      _y = x.y;
    }
    if (typeof x === 'number' && typeof y === 'number') {
      _x = x;
      _y = y;
    }

    this.pos.x += (_x as number);
    this.pos.y += (_y as number);
    this.getBounds().translate(_x as number, _y);

    return this;
  }

  /**
   * 直接移到目标位置
   * @param x 目标x位置，若为Vector2d，表示移动到的目标点
   * @param y 可选，目标y位置
   * @returns 
   */
  translateTo(x: number|Vector2d, y?: number) {
    let _x, _y;

    if (typeof x === 'object' && x instanceof Vector2d) {
      _x = x.x;
      _y = x.y;
    }
    if (typeof x === 'number' && typeof y === 'number') {
      _x = x;
      _y = y;
    }

    this.pos.x = (_x as number);
    this.pos.y = (_y as number);
    this.updateBounds();

    return this;
  }

  /**
   * 图形是否包含某个点
   * @param x 目标点的x坐标，若为Vector2d，则为目标坐标
   * @param y 可选，目标点的y坐标
   * @returns 
   */
  contains(x: number|Vector2d, y?: number): boolean {
    let _x, _y;

    if (typeof x === 'object' && x instanceof Vector2d) {
      _x = x.x;
      _y = x.y;
    }
    if (typeof x === 'number' && typeof y === 'number') {
      _x = x;
      _y = y;
    }

    let intersects = false;
    let posx = this.pos.x, posy = this.pos.y;
    let points = this.points;
    let len = points.length;
    let aimX = _x as number;
    let aimY = _y as number;

    for (let i = 0, j = len - 1; i < len; j = i++) {
        let iy = points[i].y + posy, ix = points[i].x + posx,
            jy = points[j].y + posy, jx = points[j].x + posx;
        if (((iy > aimY) !== (jy > aimY)) && (aimX < (jx - ix) * (aimY - iy) / (jy - iy) + ix)) {
            intersects = !intersects;
        }
    }
    return intersects;
  }

  /**
   * 获取多边形的矩形包围盒
   * @returns 
   */
  getBounds(): Bounds {
    if (typeof this._bounds === 'undefined') {
      this._bounds = pool.pull('tyro.Bounds');
    }
    return this._bounds;
  }

  updateBounds(): Bounds {
    let bounds = this.getBounds();

    bounds.update(this.points);
    bounds.translate(this.pos);

    return bounds;
  }
}

export default Polygon;
