import { RequestHandler } from "express"

/**
 * @openapi
 * '/post':
 *  post:
 *     tags:
 *     - Post Controller
 *     summary: Create a post
 *     parameters:
 *     - name: body
 *       in: body
 *       required: true
 *       schema: 
 *         $ref: "#/definitions/AddPostRequest"
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: "#/definitions/ErrorResponse"
 *       401:
 *         description: Invalid username / password
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: "#/definitions/ErrorResponse"
 */

/**
 * @openapi
 * '/post':
 *  get:
 *     tags:
 *     - Post Controller
 *     summary: Get posts
 *     parameters:
 *     - name: current
 *       in: query
 *       description: Page number
 *     - name: pageSize
 *       in: query
 *       description: Page size
 *     responses:
 *       200:
 *         description: Content
 *         content:
 *           application/json: 
 *             schema:
 *              type: object
 *              required:
 *              - data
 *              - page
 *              properties:
 *                data:
 *                  $ref: "#/definitions/PostSimpleArray"
 *                page:
 *                  $ref: "#/definitions/PageObject"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: "#/definitions/ErrorResponse"
 *       401:
 *         description: Invalid username / password
 *         content:
 *           application/json: 
 *             schema:
 *               $ref: "#/definitions/ErrorResponse"
 */

export const types = {
  AddPostRequest: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: {
        type: 'string'
      },
      content: {
        type: 'string'
      }
    }
  },
  PostSimple: {
    type: "object",
    required: ['id', 'title', 'author'],
    properties: {
      id: {
        description: "id",
        type: "number",
      },
      title: {
        description: "title",
        type: "string",
      },
      author: {
        description: "author",
        type: "string",
      },
    },
  },
  PostSimpleArray: {
    type: "array",
    items: {
      $ref: "#/definitions/PostSimple"
    },
  },
}

const handler: RequestHandler = function A (req, res, next) {
  if (req.method === 'POST') {
    const title: string | undefined = req.body.title
    const content: string | undefined = req.body.content
    if (!title || !content) {
      return res.status(400).json({
        error: 'invalid body'
      })
    }
    if (!req.user) {
      return res.status(401).json({
        error: 'not auth'
      })
    }
    req.app.db.get('__posts').push({
      id: Date.now(),
      title,
      content,
      author: req.user.username
    }).write()

    return res.status(201).end()
  }

  if (req.method === 'GET') {
    const current: number = Number(req.query.current ?? '1')
    const pageSize: number = Number(req.query.pageSize ?? '10')
    if (isNaN(current) || isNaN(pageSize)) {
      return res.status(400).json({
        error: 'invalid parameter'
      })
    }

    const postCount = req.app.db.get('__posts').size().value()
    const postStart = pageSize * (current - 1)
    const posts = req.app.db.get('__posts').slice(postStart, postStart + pageSize).value()

    return res.json({
      data: posts.map(i => ({
        id: i.id,
        title: i.title,
        author: i.author
      })),
      page: {
        current: current,
        size: pageSize,
        total: postCount
      }
    })
  }

  next()
}
export default handler