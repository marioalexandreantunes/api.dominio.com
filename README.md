# api.dominio.com

Exemplo simples de API RESTful - NodeJS - Express - JWT - Prisma - MongoDB

## schema.prisma

para subir o esquema/model USER
```
npx prisma db push 
```

instalar o cliente que vamos usar no projecto
```
npm install @prisma/client
```

Opcional - para manipular a base de dados (rodar o studio para a base de dados, porta 5556):
```
npx prima studio
```

## server.js

Instalar as dependencias
```
node install
```

Para rodar o projecto
(rodar server em mode 'dev nodemon' porta 3000)
```
npm run dev
```

Opcional - abre outro terminal (rodar o studio para a base de dados, porta 5556):
```
npx prima studio
```


## Segurança

A API implementa várias medidas de segurança robustas:

### Implementado ✓
- Autenticação JWT com middleware de autorização
- Proteção contra ataques usando Helmet.js
- Rate Limiting (100 req/15min global, 10 req/15min API)
- Rate limiting específico para login
- Sanitização de inputs (body, query, URL params)
- Gestão segura de senhas com crypto (salt único + scrypt)
- CORS configurado com origens específicas

### Melhorias Recomendadas !
- Implementar refresh tokens e expiração JWT
- Adicionar validação de força de senha
- Implementar verificação de email
- Melhorar sistema de logging e monitoramento
- Implementar backup automático de dados
