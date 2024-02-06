import { RequestHandler } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { types as loginTypes } from './login';
import { types as postsTypes } from './post';
import { types as postTypes } from './post--_id';
const options = {
  definition: {
    "schemes": [],
    "swagger": "2.0",
    info: {
      title: "Mini Blog API",
      description:
        "API endpoints for a mini blog services documented on swagger",
      contact: {
        name: "Desmond Obisi",
        email: "info@miniblog.com",
        url: "https://github.com/DesmondSanctity/node-js-swagger",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080/",
        description: "Local server",
      },
      {
        url: "<your live url here>",
        description: "Live server",
      },
    ],
    definitions: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string'
          }
        }
      },
      PageObject: {
        type: "object",
        required: ['current', 'size', 'total'],
        properties: {
          current: {
            description: "current",
            type: "number",
          },
          size: {
            description: "size",
            type: "number",
          },
          total: {
            description: "total",
            type: "number",
          },
        },
      },
      ...loginTypes,
      ...postsTypes,
      ...postTypes,
    },
  },
  // looks for configuration in specified directories
  apis: ["./routers/*.ts"],
};
export const swaggerSpec = swaggerJsdoc(options);
const handler: RequestHandler = function A(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
};

export default handler;
