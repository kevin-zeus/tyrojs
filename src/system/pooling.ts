interface IObjectClass<T> {
  classObj: any
  pool: Array<T> | undefined
}

type ObjectClass = {
  [key: string]: IObjectClass<any>
}

const objectClass: ObjectClass = {};
let instanceCounter = 0;

const pool = {
  /**
   * 向池中注册某类对象
   * @param className 唯一对象属性名
   * @param classObj 需要被实例化的类
   * @param recycling 是否需要被回收
   */
  register(className: string, classObj: any, recycling: boolean = false) {
    if (typeof classObj !== 'undefined') {
      objectClass[className] = {
        classObj: classObj,
        pool: recycling ? [] : undefined
      };
    } else {
      throw new Error(`Cannot register object ${className} invalid class.`)
    }
  },

  push(obj: any, throwOnError = true): boolean {
    if (!this.poolable(obj)) {
      if (throwOnError) {
        throw new Error(`pool: object ${obj} cannot be recycled.`);
      } else {
        return false;
      }
    }

    objectClass[obj.className].pool?.push(obj);
    instanceCounter++;

    return true;
  },

  /**
   * 拉取某个属性名下的一个对象
   * @param className 唯一对象类属性名
   * @returns 
   */
  pull(className: string, ...args: any[]): any {
    let objClass = objectClass[className];
    if (objClass) {
      let proto = objClass.classObj,
        poolArray = objClass.pool,
        obj;
      
      if (poolArray && ((obj = poolArray.pop()))) {
        if (typeof obj.init === 'function') {
          obj.init.apply(obj, args);
        }
        instanceCounter --;
      } else {
        obj = new (proto.bind(proto, args))();
        if (poolArray) {
          obj.className = className;
        }
      }
      return obj;
    }
    throw new Error(`Cannot instantiate object of type "${className}".`);
  },

  /**
   * 清洗对象池
   */
  purge() {
    for (let className in objectClass) {
      if (objectClass[className]) {
        objectClass[className].pool = [];
      }
    }
    instanceCounter = 0;
  },

  /**
   * 检查对象所属类是否被注册
   * @param className 唯一对象属性名
   * @returns 
   */
  exists(className: string): boolean {
    return className in objectClass;
  },

  /**
   * 判断对象是否可以添加到对象池，携带className、init、pool属性才可加入
   * @param obj 对象
   * @returns 
   */
  poolable(obj: any): boolean {
    let className: string = obj.className;
    return (typeof className !== 'undefined')
      && (typeof obj.init === 'function')
      && (className in objectClass)
      && (typeof objectClass[className].pool !== 'undefined')
  },

  getInstanceCount(): number {
    return instanceCounter;
  }
}

export default pool;
