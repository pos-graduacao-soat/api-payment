export abstract class ValueObject<T> {
  constructor(props: Partial<T & ValueObject<T>>) {
    Object.assign(this, props)
  }
}