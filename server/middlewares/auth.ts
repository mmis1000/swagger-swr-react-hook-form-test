import { RequestHandler } from "express"

const routesThatNeedAuth = [
  'post'
]

// hello.js
const handler: RequestHandler = (req, res, next) => {
  if (routesThatNeedAuth.every(i => !req.url.startsWith(i))) {
    return next()
    
  }
  const token = req.get('Authorization')?.replace(/^bearer\s+/i, '')
  const session = req.app.db.get('__sessions').value().find(i => i.token === token)
  if (session == null) {
    return res.status(400).json({
      error: 'not authenticated'
    })
  } else {
    req.user = {
      username: session.user
    }
  }
  next()
}

export default handler