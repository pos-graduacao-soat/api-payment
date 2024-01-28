import express, { Request, Response, NextFunction, Router } from 'express'
import { container } from 'tsyringe'
import { adaptErrorHandler } from '../adapters/ExpressErrorHandlerAdapter'
import { HttpErrorHandler } from './middlewares/ErrorHandler'
import { utilRoutes } from './routes/UtilsRoutes'
import { registerPaymentRoutes } from './routes/PaymentRoutes'

function startHttpServer() {

  const errorHandler = container.resolve(HttpErrorHandler)

  const expressServer = express()
  const router = Router()

  expressServer.use(express.json())
  expressServer.use(express.urlencoded({ extended: true }))
  expressServer.use(registerPaymentRoutes(router))
  expressServer.use(utilRoutes)

  expressServer.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const response = errorHandler.handle(err)
    const errorHandlerAdapter = adaptErrorHandler(response)
    return errorHandlerAdapter(req, res, next)
  })

  const httpServer = expressServer.listen(process.env.PORT || 3000, () => {
    console.log(`Http server running at port ${process.env.PORT}`)
  })

  return httpServer
}

export { startHttpServer }