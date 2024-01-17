import { Entity } from './Entity'

export class Payment extends Entity<Payment> {
  public constructor(props: Partial<Payment>) {
    super(props)

    if (!props.status) this.status = Status.RECEIVED
  }

  public orderId: string

  public status: Status

  public code: string
}

export enum Status {
  RECEIVED = 'RECEIVED',
  PAID = 'PAID',
  NOTPAID = 'NOT_PAID'
}