// 游戏模块类
import Vector2d from "./math/Vector2d";
import Bounds from "./physics/Bounds";

/** 是否已经初始化 */
export let initialized = false;

/** 初始化函数 */
export function boot() {
  if (initialized) {
    return;
  }
}