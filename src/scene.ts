namespace tyro {
  export class Scene extends tyro.Node {
    public name: string;

    private id: string;

    /**
     * 
     * @param name 场景名称，不同的场景名称必须唯一
     */
    constructor(name: string) {
      super();
      this.name = name;
      this.id = name;
    }
  }
}