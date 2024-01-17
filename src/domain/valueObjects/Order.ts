import { ValueObject } from './valueObject'

export class Order extends ValueObject<Order> {
  public constructor(props: Partial<Order>) {
    super(props)
  }

  public id: string

  public customer?: unknown

  public products: unknown[]

  public status: Status

  public totalPrice: number
}

export enum Status {
  WAITINGPAYMENT = 'WAITING_PAYMENT',
  PAYMENTPROBLEM = 'PAYMENT_PROBLEM',
  SUCCESSFULPAYMENT = 'SUCCESSFUL_PAYMENT',
}
