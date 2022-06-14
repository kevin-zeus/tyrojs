const REMOVE_PATH = /^.*(\\|\/|\:)/;
const REMOVE_EXT = /\.[^\.]*$/;

export class File {
  /**
 * 获取文件基本名称
 * @param path 资源路径
 * @returns 文件名
 */
  static getBasename(path: string): string {
    return path.replace(REMOVE_PATH, '').replace(REMOVE_EXT, '');
  }

  /**
 * 获取资源拓展名
 * @param path 资源路径
 * @returns 资源拓展名
 */
  static getExtension(path: string): string {
    return path.substring(path.lastIndexOf('.') + 1, path.length);
  }
}
