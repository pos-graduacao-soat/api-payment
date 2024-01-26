import 'reflect-metadata'
import { Status, Order } from '../../../../src/domain/valueObjects/Order'
import { HttpOrderRepository } from '../../../../src/infra/repositories/http/Order'
import { HttpService } from '../../../../src/infra/http/HttpService'

jest.mock('../../../../src/infra/http/HttpService')

describe('HttpOrderRepository', () => {
  let httpService: jest.Mocked<HttpService>
  let repository: HttpOrderRepository

  beforeEach(() => {
    httpService = new HttpService() as jest.Mocked<HttpService>
    repository = new HttpOrderRepository(httpService)
  })

  describe('getById', () => {
    it('should return null when order is not found', async () => {
      httpService.get.mockResolvedValue({ status: 404 } as any)

      const result = await repository.getById('non-existing-id')

      expect(result).toBeNull()
    })

    it('should return an order when found', async () => {
      const mockOrder = {
        data: {
          id: '1',
          status: Status.WAITINGPAYMENT,
          totalPrice: 100,
          products: [
            { id: 'product1', quantity: 1 },
            { id: 'product2', quantity: 2 },
          ],
        },
      }

      httpService.get.mockResolvedValue({ status: 200, data: mockOrder } as any)

      const result = await repository.getById('1')

      expect(result).toBeInstanceOf(Order)
      expect(result).toEqual(new Order(mockOrder.data))
    })
  })

  describe('updateStatus', () => {
    it('should return false when updating status fails', async () => {
      httpService.patch.mockResolvedValue({ status: 400 } as any)

      const result = await repository.updateStatus('1', Status.SUCCESSFULPAYMENT)

      expect(result).toBe(false)
    })

    it('should return true when updating status succeeds', async () => {
      httpService.patch.mockResolvedValue({ status: 200 } as any)

      const result = await repository.updateStatus('1', Status.PAYMENTPROBLEM)

      expect(result).toBe(true)
    })
  })
})