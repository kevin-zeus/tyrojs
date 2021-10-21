namespace tyro {
  
  export class Node extends tyro.Updatable {
    children: Node[] = []
    parent: Node|null = null
    
    private _width: number = 0 // 宽度
    private _height: number = 0 // 高度
    private _opacity: number = 1 // 透明度
    private _rotation: number = 0 // 旋转角度
    private _scaleX: number = 1 // x轴缩放值
    private _scaleY: number = 1 // y轴缩放值
    private _update: Function
    private _anchor: Vector = new Vector()

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
      child._propertyChanged = child._propertyChanged || noop;
      child._propertyChanged();
    }

    removeChild(child: Node) {
      let index = this.children.indexOf(child);
      if (index !== -1) {
        this.children.splice(index, 1);
        child.parent = null;
        child._propertyChanged();
      }
    }

    setPosition(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    get x(): number {
      return this.position.x;
    }
    set x(value: number) {
      this.position.x = value;
      this._propertyChanged();
    }

    get y(): number {
      return this.position.y;
    }
    set y(value: number) {
      this.position.y = value;
      this._propertyChanged();
    }

    get width(): number {
      return this._width;
    }
    set width(value: number) {
      this._width = value;
      this._propertyChanged();
    }

    get height(): number {
      return this._height;
    }
    set height(value: number) {
      this._height = value;
      this._propertyChanged();
    }

    get opacity(): number {
      return this._opacity;
    }
    set opacity(value: number) {
      this._opacity = value;
      this._propertyChanged();
    }

    get rotation(): number {
      return this._rotation;
    }
    set rotation(value: number) {
      this._rotation = value;
      this._propertyChanged();
    }

    get scaleX(): number {
      return this._scaleX;
    }
    set scaleX(value: number) {
      this._scaleX = value;
      this._propertyChanged();
    }

    get scaleY(): number {
      return this._scaleY;
    }
    set scaleY(value: number) {
      this._scaleY = value;
      this._propertyChanged();
    }
  }
}