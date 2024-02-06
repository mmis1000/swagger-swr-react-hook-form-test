import { express } from '@mmis1000/json-server-split'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs.json'

const router = express.Router()

export default router.use(swaggerUi.serve, swaggerUi.setup(swaggerSpec))