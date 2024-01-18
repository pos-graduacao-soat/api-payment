import { Router } from 'express'
import { container } from 'tsyringe'
import { adaptRoute } from '../../adapters/ExpressRouteAdapter'
import { CreatePaymentController } from '../../controllers/CreatePaymentController'

function registerPaymentRoutes(router: Router) {
  router.post('/payment', adaptRoute(container.resolve(CreatePaymentController)))

  return router
}

export { registerPaymentRoutes }