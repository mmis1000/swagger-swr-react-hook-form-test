import { RequestHandler } from "express"

// hello.js
const handler: RequestHandler = (req, res, next) => {
  res.header('X-Imports-As', 'EsModule')
  next()
}

export default handler