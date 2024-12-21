import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API dominio.pt',
      version: '1.0.0',
      description: 'Documentação da API do dominio.pt',
      contact: {
        name: 'Mário Antunes',
        url: 'https://github.com/marioalexandreantunes',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
      {
        url: 'https://api.dominio.pt',
        description: 'Servidor de Produção',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/v1/routes/*.js'], // Arquivos que contêm anotações do Swagger
};

const specs = swaggerJsdoc(options);

export default specs;
