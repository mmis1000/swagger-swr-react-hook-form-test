import { RequestHandler } from "express"
/**
 * @openapi
 * '/post/{id}':
 *  get:
 *     tags:
 *     - api:Post Controller
 *     summary: Get post
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Item id
 *     responses:
 *       200:
 *         description: Content
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: "#/definitions/Post"
 *       401:
 *         description: Invalid username / password
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: "#/definitions/ErrorResponse"
 *       404:
 *         description: Invalid username / password
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: "#/definitions/ErrorResponse"
 */
/**
 * @openapi
 * '/post/{id}':
 *  delete:
 *     tags:
 *     - api:Post Controller
 *     summary: Delete post
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Item id
 *     responses:
 *       201:
 *         description: Success
 *       401:
 *         description: Invalid username / password
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: "#/definitions/ErrorResponse"
 *       404:
 *         description: Invalid username / password
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: "#/definitions/ErrorResponse"
 */
/**
 * @openapi
 * '/post/{id}':
 *  patch:
 *     tags:
 *     - api:Post Controller
 *     summary: Modify post
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Item id
 *     - name: body
 *       in: body
 *       required: true
 *       schema: 
 *         $ref: "#/definitions/PatchPostRequest"
 *     responses:
 *       201:
 *         description: Success
 *       401:
 *         description: Invalid username / password
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: "#/definitions/ErrorResponse"
 *       404:
 *         description: Invalid username / password
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: "#/definitions/ErrorResponse"
 */

export const types = {
  PatchPostRequest: {
    type: "object",
    properties: {
      title: {
        description: "title",
        type: "string",
      },
      content: {
        description: "content",
        type: "string",
      },
    }
  },
  Post: {
    type: "object",
    required: ['id', 'title', 'content', 'author'],
    properties: {
      id: {
        description: "id",
        type: "number",
      },
      title: {
        description: "title",
        type: "string",
      },
      content: {
        description: "content",
        type: "string",
      },
      author: {
        description: "author",
        type: "string",
      },
    },
  },
}

const handler: RequestHandler = function A (req, res, next) {
  if (req.method === 'GET') {
    const post = req.app.db.get('__posts').find({ id: Number(req.params.id) }).value()
    if (post) {
      return res.json(post)
    } else {
      return res.status(404).json({
        error: 'not found'
      })
    }
  }
  if (req.method === 'DELETE') {
    const post = req.app.db.get('__posts').find({ id: Number(req.params.id) }).value()
    if (post) {
      req.app.db.get('__posts').remove({ id: Number(req.params.id) }).write()
      return res.status(201).end()
    } else {
      return res.status(404).json({
        error: 'not found'
      })
    }
  }
  if (req.method === 'PATCH') {
    const post = req.app.db.get('__posts').find({ id: Number(req.params.id) }).value()
    const params: Record<string, string> = {}
    if (req.body.title) params.title = req.body.title
    if (req.body.content) params.title = req.body.content
    if (post) {
      req.app.db.get('__posts').find({ id: Number(req.params.id) }).assign(params).write()
      return res.status(201).end()
    } else {
      return res.status(404).json({
        error: 'not found'
      })
    }
  }

  next()
}
export default handler