let uid = 0;

export default class Utils {
  public static getUid(prefix?: string) {
    let id = ++uid;
    if (prefix) {
      let charCode = prefix.charCodeAt(prefix.length - 1);
      if (charCode >= 48 && charCode <= 57) prefix += '_';
      return prefix + id;
    }
    return id + '';
  }
}