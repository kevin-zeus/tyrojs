interface IPoolDic {
  [key: string]: any[]
}

export default class Pool {
  private static POOLSIGN: string = "__isInPool";
  private static _poolDic: IPoolDic = {};

  static getPoolBySign(sign: string): any[] {
    return Pool._poolDic[sign] || (Pool._poolDic[sign] = []);
  }

  static clearBySign(sign: string): void {
    if (Pool._poolDic[sign]) Pool._poolDic[sign].length = 0;
  }

  static recover(sign: string, item: any) {
    if (item[Pool.POOLSIGN]) return;
    item[Pool.POOLSIGN] = true;
    Pool.getPoolBySign(sign).push(item);
  }

  static getItemByClass<T>(sign: string, cls: new () => T): T {
    if (!Pool._poolDic[sign]) return new cls();

    let pool = Pool._poolDic[sign];
    if (pool.length) {
      var rst = pool.pop();
      rst[Pool.POOLSIGN] = false;
    } else {
      rst = new cls()
    }
    return rst;
  }
}