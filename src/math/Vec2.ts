const EPSILON : number = 0.00001 ;

export default class Vec2 {
  public values: Float32Array;

  constructor(x: number, y: number) {
    this.values = new Float32Array([x, y]);
  }

  public static create(x: number = 0, y: number = 0): Vec2 {
    return new Vec2(x, y);
  }

  public toString(): string {
    return `[${this.values[0]}, ${this.values[1]}]`;
  }

  public get x(): number { return this.values[0]; }
  public set x(val: number) { this.values[0] = val; }

  public get y(): number { return this.values[1]; }
  public set y(val: number) { this.values[1] = val; }

  public reset(x: number = 0, y: number): Vec2 {
    this.values[0] = x;
    this.values[1] = y;
    return this;
  }

  public equals(vector: Vec2): boolean {
    if (Math.abs(this.values[0] - vector.values[0]) > EPSILON) {
      return false;
    }
    if (Math.abs(this.values[1] - vector.values[1]) > EPSILON) {
      return false;
    }
    return true;
  }
}