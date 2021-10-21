namespace tyro {
  export class Scene extends tyro.Node {
    public name: string;

    private id: string;

    constructor(name: string) {
      super();
      this.name = name;
      this.id = name;
    }
  }
}