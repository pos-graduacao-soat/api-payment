import express, { Request, Response, NextFunction, Router } from 'express'
import { container } from 'tsyringe'
import { adaptErrorHandler } from '../adapters/ExpressErrorHandlerAdapter'
import { HttpErrorHandler } from './middlewares/ErrorHandler'
import { utilRoutes } from './routes/UtilsRoutes'
import { registerPaymentRoutes } from './routes/CustomerRoutes'

function startHttpServer() {

  const errorHandler = container.resolve(HttpErrorHandler)

  const server = express()
  const router = Router()

  server.use(express.json())
  server.use(express.urlencoded({ extended: true }))
  server.use(registerPaymentRoutes(router))
  server.use(utilRoutes)

  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const response = errorHandler.handle(err)
    const errorHandlerAdapter = adaptErrorHandler(response)
    return errorHandlerAdapter(req, res, next)
  })

  server.listen(process.env.PORT || 3000, () => {
    console.log(`Http server running at port ${process.env.PORT}`)
  })
}

export { startHttpServer }