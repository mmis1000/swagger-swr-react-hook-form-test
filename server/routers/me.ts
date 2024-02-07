import { RequestHandler } from "express"
/**
 * @openapi
 * '/me':
 *  get:
 *    tags:
 *    - api:User Controller
 *    summary: get user info
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json: 
 *            schema:
 *              type: object
 *              required:
 *              - username
 *              properties:
 *                username:
 *                  type: string
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
  if (req.method !== 'GET') {
    return res.status(400).json({
      error: 'invalid method'
    })
  }

  if (!req.user) {
    return res.status(401).json({
      error: 'invalid credential'
    })
  }

  return res.json({
    username: req.user.username
  })
}

export default handler