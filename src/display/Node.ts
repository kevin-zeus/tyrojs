import EventDispatcher from "../events/EventDispatcher";
import Matrix2d from "../math/Matrix2d";
import RenderTypeConst from "../constants/RenderTypeConst";
import RepainTypeConst from "../constants/RepainTypeConst";

export default class Node extends EventDispatcher {
  /** 节点类型 */
  type: string = 'node';
  /** 节点名称 */
  name: string = '';
  /** 节点是否可见 */
  visible: boolean = true;
  /** 鼠标事件是否可穿透 */
  mouseThrough: boolean = false;
  /** 是否自动计算宽高，默认false，开启有性能损耗 */
  autoSize: boolean = false;
  /** 
   * 指定鼠标事件优先检测自身还是其子节点，
   * @default false 优先检测其子节点，当递归检测完所有子节点之后，仍然没有找到目标对象，再检测本身
  */
  hitTestPrior: boolean = false;

  /** 父节点 */
  private _parent: Node|null = null;
  /** 子节点栈 */
  private _children: Node[] = [];
  /** 所属场景 */
  private _scene: any;
  /** 节点是否被销毁 */
  private _destroyed: boolean = false;
  /** x坐标位置 */
  private _x: number = 0;
  /** y坐标位置 */
  private _y: number = 0;
  /** 节点宽 */
  private _width: number = 0;
  /** 节点高 */
  private _height: number = 0;
  /** 节点变换对象 */
  private _transform: Matrix2d|null = null;
  /** z轴排序，数字越大越靠前 */
  private _zIndex: number = 0;
  /** 鼠标状态 */
  private _mouseEnabled: boolean = true;
  /** 节点渲染类型 */
  private _renderType: number = RenderTypeConst.NONE;
  /** 重绘方式 */
  private _repain: number = RepainTypeConst.REPAIN_NONE;

  constructor() {
    super();

    this.onLoad()
  }

  onLoad(): void {}

  update(dt: number) {}

  onDestory(): void {}

  get childrenCount(): number {
    return this._children.length;
  }

  get parent(): Node|null {
    return this._parent;
  }

  get scene(): any {
    return this._scene;
  }

  get destroyed(): boolean {
    return this._destroyed;
  }

  get x(): number {
    return this._x;
  }
  set x(val: number) {
    if (this.destroyed) return;
    if (this._x !== val) {
      this._x = val;
      // TODO: 绘制
    }
  }

  get y(): number {
    return this._y;
  }
  set y(val: number) {
    if (this.destroyed) return;
    if (this._y !== val) {
      this._y = val;
      // TODO: 绘制
    }
  }

  get width(): number {
    return this._width;
  }
  set width(val: number) {
    if (this.destroyed) return;
    if (this._width !== val) {
      this._width = val;
      // TODO: 修改 tansform
    }
  }

  get height(): number {
    return this._height;
  }
  set height(val: number) {
    if (this.destroyed) return;
    if (this._height !== val) {
      this._height = val;
      // TODO: 修改transform
    }
  }

  get mouseEnabled(): boolean {
    return this._mouseEnabled;
  }
  set mouseEnabled(val: boolean) {
    this._mouseEnabled = val;
  }

  /**
   * 销毁本节点
   * @param isDestoryChild 是否销毁子节点，默认为 true
   */
  destory(isDestoryChild: boolean = true): void {
    this._destroyed = true;
    this._parent && this._parent.removeChild(this); 

    // 销毁子节点
    if (this._children.length > 0) {
      if (isDestoryChild) this.destoryChildren()
      else this.removeChildren()
    }
    this.onDestory()

    // 重置子节点数组、清除所有节点内所有事件
    this._children = [];
    this.offAll()
  }

  /**
   * 销毁子节点，不销毁自身
   */
  destoryChildren(): void {
    if (this._children) {
      for (let i: number = 0; i < this._children.length; i++) {
        this._children[i].destory()
      }
    }
  }

  /**
   * 添加子节点
   * @param node 节点对象
   * @returns 返回添加的节点
   */
  addChild(node: Node): Node {
    if (!node || this._destroyed || node === this) return node;
    if (node._parent === this) {
      let index: number = this.getChildIndex(node);
      if (index !== this._children.length - 1) {
        this._children.splice(index, 1);
        this._children.push(node)
        this._childChanged(node)
      }
    } else {
      node._parent && node._parent.removeChild(node);
      this._children.push(node);
      node._setParent(this);
      this._childChanged(node)
    }
    return node;
  }

  /**
   * 批量增加子节点
   * @param args 无数子节点
   */
  addChildren(...args: Node[]): void {
    let i: number = 0, n: number = args.length;
    while (i < n) {
      this.addChild(args[i++])
    }
  }

  addChildAt(node: Node, index: number): Node {
    if (!node || this._destroyed || node === this) return node;
    if (index >= 0 && index <= this._children.length) {
      if (node.parent === this) {
        let oldIndex: number = this.getChildIndex(node);
        this._children.splice(oldIndex, 1);
        this._children.splice(index, 0, node);
        this._childChanged(node);
      } else {
        node._parent && node._parent.removeChild(node);
        this._children.splice(index, 0, node);
        this._childChanged(node);
      }
      return node;
    } else {
      throw new Error('addChildAt：index 索引超出 children 数组边界！')
    }
  }

  /**
   * 根据子节点对象，返回子节点的索引位置
   * @param node 子节点
   * @returns 子节点所在的索引位置
   */
  getChildIndex(node: Node): number {
    return this._children.indexOf(node);
  }

  /**
   * 根据子节点的名字，获取子节点对象
   * @param name 子节点的名字
   * @returns 节点对象
   */
  getChildByName(name: string): Node|null {
    let nodes: Node[] = this._children;
    if (nodes) {
      for (let i: number = 0; i < nodes.length; i++) {
        let node: Node = nodes[i];
        if (!node) continue;
        if (node.name === name) return node;
      }
    }
    return null;
  }

  /**
   * 根据子节点索引，获取子节点对象
   * @param index 索引位置
   * @returns 子节点
   */
  getChildAt(index: number): Node|null {
    return this._children[index] || null
  }

  /**
   * 设置子节点的索引位置
   * @param node 子节点
   * @param index 新的索引
   * @returns 返回子节点本身
   */
  setChildIndex(node: Node, index: number): Node {
    let nodes: Node[] = this._children;
    if (index < 0 || index >= nodes.length) {
      throw new Error('setChildIndex：index 索引超出 children 数组边界！')
    }

    let oldIndex: number = this.getChildIndex(node);
    if (oldIndex < 0) {
      throw new Error('setChildIndex：节点必须是本对象的子节点！');
    }

    this._children.splice(oldIndex, 1);
    this._children.splice(index, 0, node);
    this._childChanged(node);
    return node;
  }

  /**
   * 删除子节点
   * @param node 子节点
   * @returns 被删除的节点
   */
  removeChild(node: Node): Node|null {
    if (this._children.length === 0) return node;
    let index: number = this.getChildIndex(node);
    return this.removeChildAt(index);
  }

  /**
   * 从父节点中删除自己，如已经被删除则不会抛出异常
   * @returns 当前节点对象
   */
  removeFromParent(): Node {
    this._parent && this._parent.removeChild(this);
    return this;
  }

  /**
   * 根据子节点名称删除对应的子节点对象，如果找不到不会抛出异常
   * @param name 节点名
   * @returns 查找到的节点对象，没找到返回 null
   */
  removeChildByName(name: string): Node|null {
    const node: Node|null = this.getChildByName(name);
    node && this.removeChild(node);
    return node;
  }

  /**
   * 根据索引删除子节点对象
   * @param index 节点索引位置
   * @returns 根据索引找到的节点，没找到返回 null
   */
  removeChildAt(index: number): Node|null {
    const node: Node|null = this.getChildAt(index);
    if (node) {
      this._children.splice(index, 1);
      node._setParent(null);
    }
    return node;
  }

  /**
   * 删除指定索引区间的所有子节点
   * @param beginIndex 开始索引
   * @param endIndex 结束索引
   * @returns 当前节点对象
   */
  removeChildren(beginIndex: number = 0, endIndex: number = 0x7ffffffff): Node {
    if (this._children && this._children.length > 0) {
      let nodes: Node[] = this._children;
      if (beginIndex === 0 && endIndex >= nodes.length - 1) {
        this._children = [];
      } else {
        nodes = this._children.splice(beginIndex, endIndex - beginIndex + 1);
      }
      for (let i: number = 0; i < nodes.length; i++) {
        nodes[i]._setParent(null);
      }
    }
    return this;
  }

  /**
   * 替换子节点
   * 将新的节点对象替换到已有的节点索引位置
   * @param newChild 新的子节点
   * @param oldChild 老的子节点
   * @returns 返回新的子节点
   */
  replaceChild(newChild: Node, oldChild: Node): Node|null {
    let index: number = this.getChildIndex(oldChild);
    if (index > -1) {
      this._children.splice(index, 1, newChild);
      oldChild._setParent(null);
      newChild._setParent(this);
      return newChild;
    }
    return null;
  }

  /**
   * 当前容器的子孙节点中是否包含指定节点对象
   * @param node 节点对象
   * @returns 布尔值
   */
  contains(node: Node): boolean {
    if (node === this) return true;
    let _node: Node|null = node;
    while (_node) {
      if (_node._parent === this) return true;
      _node = _node._parent;
    }
    return false;
  }

  private _setParent(parent: Node|null) {
    if (this._parent === parent) return;
    if (parent) {
      this._parent = parent;
      // 如果父节点可见，设置子节点可见
    }
  }

  private _setTransform(): void {
    this._renderType |= RenderTypeConst.TRANSFORM;
    this.parentRepaint(RepainTypeConst.REPAIN_CACHE);
  }

  parentRepaint(repatinType: number = RepainTypeConst.REPAIN_CACHE): void {
    const p: Node|null = this._parent;
    if (p && !(p._repain & repatinType)) {
      p._repain |= repatinType;
      p.parentRepaint(repatinType);
    }
  }

  repain(renderType: number = RepainTypeConst.REPAIN_CACHE): void {
    if (!(this._repain & renderType)) {
      this._repain |= renderType;
      this.parentRepaint(renderType);
    }
  }
 
  protected _childChanged(child: Node): void {}

  /** 重绘 */
  protected _repaint(): void {}
}