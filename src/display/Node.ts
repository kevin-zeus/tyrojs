import Event from "../event/Event";
import Renderer from "../renderer/Renderer";
import Utils from "../utils/Utils";

export default class Node extends Event {
  [key: string]: any;

  protected _id: string = Utils.getUid('Node')
  private _x: number = 0
  private _y: number = 0
  private _width: number = 0
  private _height: number = 0
  private _alpha: number = 1
  private _rotation: number = 0
  private _visible: boolean = true
  private _anchorX: number = 0
  private _anchorY: number = 0
  private _scaleX: number = 1
  private _scaleY: number = 1
  private _pointerEnabled: boolean = true
  private _mask: any = null
  private _align: any = null
  private _drawable: any = null
  private _parent: any = null
  private _zIndex: number = -1
  private _transform: any = null
  private _blendMode: string = 'source-over'
  private _background: any = null

  constructor() {
    super()
  }

  get id(): string {
    return this._id;
  }
  
  get x(): number {
    return this._x;
  }
  set x(val: number) {
    this._x = val;
  }

  get y(): number {
    return this._y;
  }
  set y(val: number) {
    this._y = val;
  }

  get width(): number {
    return this._width;
  }
  set width(val: number) {
    this._width = val;
  }

  get height(): number {
    return this._height;
  }
  set height(val: number) {
    this._height = val;
  }

  get alpha(): number {
    return this._alpha;
  }
  set alpha(val: number) {
    this._alpha = val;
  }

  get rotation(): number {
    return this._rotation;
  }
  set rotation(val: number) {
    this._rotation = val;
  }

  get visible(): boolean {
    return this._visible;
  }
  set visible(val: boolean) {
    this._visible = val;
  }

  get anchorX(): number {
    return this._anchorX;
  }
  set anchorX(val: number) {
    this._anchorX = val;
  }

  get anchorY(): number {
    return this._anchorY;
  }
  set anchorY(val: number) {
    this._anchorY = val;
  }

  get scaleX(): number {
    return this._scaleX;
  }
  set scaleX(val: number) {
    this._scaleX = val;
  }

  get scaleY(): number {
    return this._scaleY;
  }
  set scaleY(val: number) {
    this._scaleY = val;
  }

  get pointerEnabled(): boolean {
    return this._pointerEnabled;
  }
  set pointerEnabled(val: boolean) {
    this._pointerEnabled = val;
  }

  get mask(): any {
    return this._mask;
  }
  set mask(val: any) {
    this._mask = val;
  }

  get align(): any {
    return this._align;
  }
  set align(val: any) {
    this._align = val;
  }

  get drawable(): any {
    return this._drawable;
  }
  set drawable(val: any) {
    this._drawable = val;
  }

  get parent(): any {
    return this._parent;
  }
  set parent(val: any) {
    this._parent = val;
  }

  get zIndex(): number {
    return this._zIndex;
  }
  set zIndex(val: number) {
    this._zIndex = val;
  }

  get transform(): any {
    return this._transform;
  }
  set transform(val: any) {
    this._transform = val;
  }

  get blendMode(): string {
    return this._blendMode;
  }
  set blendMode(val: string) {
    this._blendMode = val;
  }

  get background(): string {
    return this._background;
  }
  set background(val: string) {
    this._background = val;
  }

  /**
   * 获取 Stage
   * @returns Stage 或null
   */
  getStage() {
    let obj = this, parent;
    while (parent = obj._parent) obj = parent;
    // stage对象上面有 canvas 属性，且stage的 _parent为 null
    if (obj.canvas) return obj;
    return null;
  }

  /**
   * 可视对象的具体渲染逻辑，子类可通过覆盖此方法实现自己的渲染
   * @param renderer 渲染器
   * @param delta 渲染时间偏移量
   */
  render(renderer: Renderer, delta: number) {
    renderer.draw(this)
  }
}