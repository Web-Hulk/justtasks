import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JUSTTASKS API',
      version: '1.0.0',
      description: 'API documentation for JUSTTASKS',
    },
  },
  apis: ['./src/routes/*/*.ts'], // Path to your route files for JSDoc comments
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);