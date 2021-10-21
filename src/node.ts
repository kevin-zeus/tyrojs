namespace tyro {
  export class Node extends tyro.Updatable {
    _w: number = 0 // 宽度
    _h: number = 0 // 高度
    position: Vector = new Vector(0, 0)
    scaleX: number = 1
    scaleY: number = 1
    children: Node[] = []
    opacity: number = 1
    rotation: number = 0

    parent: Node|null = null

    private _update: Function

    constructor() {
      super();
      this._update = this.advance;
    }

    update(dt: number) {
      this._update(dt);

      this.children.map(child => child.update && child.update(dt));
    }

    addChild(child: Node) {
      this.children.push(child);
      child.parent = this;
    }

    removeChild(child: Node) {
      let index = this.children.indexOf(child);
      if (index !== -1) {
        this.children.splice(index, 1);
        child.parent = null;
      }
    }

    get x() {
      return this.position.x;
    }

    set x(value: number) {
      this.position.x = value;
      this._propertyChanged();
    }

    get y() {
      return this.position.y;
    }

    set y(value: number) {
      this.position.y = value;
      this._propertyChanged();
    }

    get width() {
      return this._w;
    }

    set width(value: number) {
      this._w = value;
      this._propertyChanged();
    }

    get height() {
      return this._h;
    }

    set height(value: number) {
      this._h = value;
      this._propertyChanged();
    }
  }
}