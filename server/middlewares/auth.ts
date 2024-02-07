import { RequestHandler } from "express"

const routesThatNeedAuth = [
  '/post',
  '/me'
]

// hello.js
const handler: RequestHandler = (req, res, next) => {
  const token = req.get('Authorization')?.replace(/^bearer\s+/i, '')
  console.log(token)

  const session = req.app.db.get('__sessions').value().find(i => i.token === token)
  console.log(session)
  if (session == null) {
    if (routesThatNeedAuth.every(i => !req.url.startsWith(i))) {
      return next()
    }

    return res.status(401).json({
      error: 'not authenticated'
    })
  } else {
    req.user = {
      username: session.user
    }
    return next()
  }
}

export default handler