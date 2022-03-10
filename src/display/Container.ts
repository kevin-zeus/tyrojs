import Renderer from "../renderer/Renderer";
import Utils from "../utils/Utils";
import Node from "./Node";

export default class Container extends Node {

  protected _id: string = Utils.getUid('Container')
  private _children: Node[] = [];

  constructor(children?: any[]) {
    super()

    if (children) this._updateChildren()
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

  getChildIndex(child: Node): number {
    return this._children.indexOf(child);
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