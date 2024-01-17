import { Router } from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'
import yaml from 'yaml'
import swaggerUi from 'swagger-ui-express'

const utilRoutes = Router()

const swaggerPath = join(__dirname, '..', '..', '..', '..', 'docs', 'swagger.yaml')
const swaggerContent = readFileSync(swaggerPath, 'utf8')

const swaggerDocument = yaml.parse(swaggerContent)

utilRoutes.use('/doc', swaggerUi.serve)
utilRoutes.get('/doc', swaggerUi.setup(swaggerDocument))

export { utilRoutes }