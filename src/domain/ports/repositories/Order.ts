import { Order, Status } from '../../valueObjects/Order'

export interface IOrderRepository {
  getById: (id: string) => Promise<Order | null>
  updateStatus: (id: string, status: Status) => Promise<boolean>
}