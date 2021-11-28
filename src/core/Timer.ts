export type TimeCallback = (id: number, data: any) => void;

export default class Timer {
  public id: number = -1
  public enabled: boolean = false
  public callback: TimeCallback
  public callbackData: any = undefined
  public countdown: number = 0
  // 触发的时间间隔，毫秒
  public timeout: number = 0
  // 是否只触发一次
  public onlyOnce: boolean = false

  constructor(callback: TimeCallback) {
    this.callback = callback;
  }
}