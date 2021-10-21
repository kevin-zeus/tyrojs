namespace tyro {
  export class Updatable {
    public position = new Vector();
    private velocity = new Vector();
    private acceleration = new Vector();
    private _ttl = Infinity;

    constructor() {
      this.dx = 0;
      this.dy = 0;
      this.ax = 0;
      this.ay = 0;
    }

    /**
     * 
     * @param {Number} dt 自上次更新以来的时间
     */
    advance(dt: number) {
      let acceleration = this.acceleration;
      if (dt) {
        acceleration = acceleration.scale(dt);
      }

      this.velocity = this.velocity.add(acceleration);
      let velocity = this.velocity;
      if (dt) {
        velocity = velocity.scale(dt);
      }

      this.position = this.position.add(velocity);
      this._propertyChanged();

      this._ttl --;
    }

    /**
     * 速度向量的x坐标
     */
    get dx() {
      return this.velocity.x;
    }

    set dx(value: number) {
      this.velocity.x = value;
    }

    /**
     * 速度向量的y坐标
     */
    get dy(): number {
      return this.velocity.y;
    }

    set dy(value: number) {
      this.velocity.y = value;
    }


    /**
     * 加速度向量的x坐标
     */
    get ax() {
      return this.velocity.x;
    }

    set ax(value: number) {
      this.velocity.x = value;
    }

    /**
     * 加速度向量的y坐标
     */
    get ay(): number {
      return this.velocity.y;
    }

    set ay(value: number) {
      this.velocity.y = value;
    }

    isAlive() {
      return this._ttl > 0;
    }

    // 属性更改 property changed
    protected _propertyChanged() {}
  }
}