import { RequestHandler } from "express"
/**
 * @openapi
 * '/logout':
 *  post:
 *    tags:
 *    - api:User Controller
 *    summary: Logout as an user
 *    responses:
 *      201:
 *        description: Created
 *      401:
 *        description: Invalid username / password
 *        content:
 *          application/json: 
 *            schema:
 *              $ref: "#/definitions/ErrorResponse"
 */

export const types = {
  LoginResult: {
    type: 'object',
    properties: {
      token: {
        type: 'string'
      }
    }
  },
}
const handler: RequestHandler = function A (req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({
      error: 'invalid method'
    })
  }

  const user = req.user

  if (user) {
    console.log('logout')
    const token = req.get('Authorization')?.replace(/^bearer\s+/i, '')
    console.log(token)
    req.app.db.get('__sessions').remove(i => i.token === token).write()
    return res.status(201).end()
  }

  return res.status(401).json({
    error: 'not logged in'
  })
}

export default handler