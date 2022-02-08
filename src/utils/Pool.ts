interface IPoolDic {
  [key: string]: any[]
}

export class Pool {
  private static _poolDic: IPoolDic = {};

  static getPoolBySign(sign: string): any[] {
    return Pool._poolDic[sign] || (Pool._poolDic[sign] = []);
  }

  static clearBySign(sign: string): void {
    if (Pool._poolDic[sign]) Pool._poolDic[sign].length = 0;
  }
}