import { Router } from 'express'
import { container } from 'tsyringe'
import { adaptRoute } from '../../adapters/ExpressRouteAdapter'
import { CreatePaymentController } from '../../controllers/CreatePaymentController'
import { ProcessPaymentController } from '../../controllers/ProcessPaymentController'

function registerPaymentRoutes(router: Router) {
  router.post('/payment', adaptRoute(container.resolve(CreatePaymentController)))
  router.post('/payment/process', adaptRoute(container.resolve(ProcessPaymentController)))

  return router
}

export { registerPaymentRoutes }