namespace tyro {

  export class Helper {
    /**
     * 
     * @param min 最小值
     * @param max 最大值
     * @param value 某个值
     * @returns 
     */
    static clamp(min: number, max: number, value: number): number {
      return Math.min(Math.max(min, value), max);
    }

    
  }
}