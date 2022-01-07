// 实用类
import pool from "./system/pooling";

// 游戏模块类
import Vector2d from "./math/Vector2d";
import Bounds from "./physics/Bounds";

export let initialized = false;

export function boot() {
  if (initialized) {
    return;
  }

  // 将所有内置对象注册到对象池中
  pool.register('tyro.Vector2d', Vector2d, true);
  pool.register('tyro.Bounds', Bounds, true);
}