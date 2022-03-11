import Renderer from "../renderer/Renderer";
import Utils from "../utils/Utils";
import Node from "./Node";

export default class Container extends Node {

  protected _id: string = Utils.getUid('Container')
  private _children: Node[] = [];

  constructor(children?: any[]) {
    super()

    if (children) {
      this._children = children
      this._updateChildren()
    }
  }

  /**
   * 返回容器的子节点个数
   * @returns {Number}
   */
  getNumChildren() {
    return this._children.length;
  }

  /**
   * 在指定索引位置添加子节点
   * @param child 子节点
   * @param index 指定的索引位置，从0开始
   * @returns {Container}
   */
  addChildAt(child: Node, index: number): Container {
    let children = this._children,
      len = children.length,
      parent = child.parent;
    
    index = index < 0 ? 0 : index > len ? len : index;
    let childIndex = this.getChildIndex(child);
    if (childIndex === index) {
      return this;
    } else if (childIndex >= 0) {
      children.splice(childIndex, 1);
      index = index === len ? len - 1 : index;
    } else if (parent) {
      parent.removeChild(child);
    }

    children.splice(index, 0, child);

    if (childIndex < 0) {
      this._updateChildren(index)
    } else {
      let startIndex = childIndex < index ? childIndex : index;
      let endIndex = childIndex < index ? index : childIndex;
      this._updateChildren(startIndex, endIndex + 1)
    }

    return this;
  }

  /**
   * 在最上面添加子节点
   * @param child 子节点
   * @returns {Container}
   */
  addChild(child: Node): Container {
    let len = this._children.length;
    this.addChildAt(child, len);
    return this;
  }

  /**
   * 在指定索引位置删除子节点
   * @param index 指定删除元素的索引位置，从0开始
   * @returns 被删除的节点
   */
  removeChildAt(index: number): Node|null {
    let children = this._children;
    if (index < 0 || index >= children.length) return null;

    let child = children[index];
    if (child) {
      if (!child.$$renderer) {
        let obj = child;
        while (obj = obj.parent) {
          // obj 是 stage，stage有renderer对象
          if (obj.renderer) {
            child.$$renderer = obj.renderer;
            break;
          } else if (obj.$$renderer) {
            child.$$renderer = obj.$$renderer;
            break;
          }
        }
      }

      if (child.$$renderer) {
        child.$$renderer.remove(child);
      }

      child.parent = null;
      child.zIndex = -1;
    }

    children.splice(index, 1);
    this._updateChildren(index);

    return child
  }

  /**
   * 删除指定的子节点
   * @param child 将被删除的子节点
   * @returns 被删除的子节点
   */
  removeChild(child: Node): Node|null {
    return this.removeChildAt(this.getChildIndex(child))
  }

  /**
   * 通过节点的唯一id来删除节点
   * @param id 子节点的唯一id
   * @returns 被删除的子节点
   */
  removeChildById(id: string): Node|null {
    let children = this._children, child;
    for (let i = 0, len = children.length; i < len; i++) {
      child = children[i];
      if (child.id === id) {
        this.removeChildAt(i)
        return child;
      }
    }
    return null;
  }

  /**
   * 删除所有子节点
   * @returns 当前容器对象
   */
  removeAllChild(): Container {
    while (this._children.length) this.removeChildAt(0)
    return this;
  }

  /**
   * 获取某个索引位置的子节点
   * @param index 索引
   * @returns 某个索引位置的子节点
   */
  getChildAt(index: number): Node|null {
    let children = this._children;
    if (index < 0 || index >= children.length) return null;
    return children[index];
  }

  /**
   * 通过子节点的id来获取子节点
   * @param id 子节点的唯一id
   * @returns 子节点
   */
  getChildById(id: string): Node|null {
    let children = this._children, child;
    for (let i = 0, len = children.length; i < len; i++) {
      child = children[i];
      if (child.id === id) return child;
    }
    return null;
  }

  /**
   * 获取某个子节点的索引位置，-1表示没有该子节点
   * @param child 子节点
   * @returns 子节点索引位置
   */
  getChildIndex(child: Node): number {
    return this._children.indexOf(child);
  }

  /**
   * 判断当前容器是否包含某个节点
   * @param child 某个节点
   * @returns 
   */
  contains(child: Node): boolean {
    while (child = child.parent) {
      if (child === this) return true;
    }
    return false;
  }

  render(renderer: Renderer, delta: number): void {
    super.render.call(this, renderer, delta);

    let children = this._children.slice(0), i, len, child; 
    for (i=0, len = children.length; i < len; i++) {
      child = children[i];
      if (child.parent === this) child.render(renderer, delta)
    }
  }

  private _updateChildren(startIndex?: number, endIndex?: number) {
    let children = this._children, child;
    startIndex = startIndex || 0;
    endIndex = endIndex || children.length;
    for (let i = startIndex; i < endIndex; i++) {
      child = children[i];
      child.zIndex = i + 1;
      child.parent = this;
    }
  }
}