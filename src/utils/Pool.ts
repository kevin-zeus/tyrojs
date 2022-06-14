export class Pool {
  private static _clsID: number = 0;
  private static POOLSIGN: string = '__HadInPool';
  private static _poolDic: any = {};

  static getPoolBySign(sign: string): any[] {
    return Pool._poolDic[sign] || (Pool._poolDic[sign] = []);
  }

  static clearBySign(sign: string): void {
    if (Pool._poolDic[sign]) Pool._poolDic[sign].length = 0;
  }

  static recover(sign: string, obj: any): void {
    if (obj[Pool.POOLSIGN]) return;
    obj[Pool.POOLSIGN] = true;
    Pool.getPoolBySign(sign).push(obj);
  }

  static recoverByClass(instance: any): void {
    if (instance) {
      let className: string = instance['__className'] || instance.constructor._$gid;
      if (className) Pool.recover(className, instance);
    }
  }

  private static _getClassSign(cls: any): string {
    let className = cls['__className'] || cls['_$gid'];
    if (!className) {
      cls['_$gid'] = className = Pool._clsID + '';
      Pool._clsID++;
    }
    return className;
  }

  static createByClass<T>(cls: new () => T): T {
    return Pool.getInstanceByClass(Pool._getClassSign(cls), cls);
  }

  static getInstanceByClass<T>(sign: string, cls: new () => T): T {
    
  }
}