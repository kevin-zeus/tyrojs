interface IPoolableClass<T> {
  className: string
  pool: T[]
  onResetEvent: Function
}

export default IPoolableClass;
