import Node from "../display/Node";
import Stage from "../display/Stage";

export default abstract class Renderer {
  renderType: string = ''
  canvas: any = null
  stage: Stage|null = null
  blendMode: string = 'source-over'

  abstract startDraw(target: Node): boolean

  abstract draw(target: Node): void

  abstract endDraw(target: Node): void

  abstract transform(target: Node): void

  hide() {}

  abstract remove(target: Node): void

  abstract clear(x: number, y: number, width: number, height: number): void

  abstract resize(width: number, height: number): void
}