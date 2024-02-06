import { RequestHandler } from "express"
/**
 * @openapi
 * '/login':
 *  post:
 *    tags:
 *    - api:User Controller
 *    summary: Login as an user
 *    parameters:
 *    - name: body
 *      in: body
 *      required: true
 *      schema: 
 *        type: object
 *        required:
 *          - username
 *          - password
 *        properties:
 *          username:
 *            type: string
 *            default: johndoe
 *          password:
 *            type: string
 *            default: "johnDoe20!@"
 *    responses:
 *      200:
 *        description: Created
 *        content:
 *          application/json: 
 *            schema:
 *              $ref: "#/definitions/LoginResult"
 *      400:
 *        description: Bad request
 *        content:
 *          application/json: 
 *            schema:
 *              $ref: "#/definitions/ErrorResponse"
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

  const matchedUser = req.app.db.get('__users').find({
    username: req.body.username,
    password: req.body.password,
  }).value()

  if (matchedUser) {
    const token = Math.random().toString(16).slice(2) + '.' + Math.random().toString(16).slice(2) + '.' + Math.random().toString(16).slice(2)
    req.app.db.get('__sessions').push({
      user: matchedUser.username,
      token: token
    })
    req.app.db.write()
    return res.json({
      token: token
    })
  }

  return res.status(401).json({
    error: 'invalid credential'
  })
}

export default handler