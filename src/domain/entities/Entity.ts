import { v4 } from 'uuid'

export abstract class Entity<T> {
  public readonly id: string
  public createdAt: Date
  public updatedAt: Date

  constructor(props: Partial<T & Entity<T>>) {
    Object.assign(this, props)

    this.id = props.id ?? this.generateId()

    if (!props.id) {
      this.createdAt = props.createdAt ?? new Date()
      this.updatedAt = props.updatedAt ?? new Date()
    }
  }

  private generateId(): string {
    return v4()
  }
}