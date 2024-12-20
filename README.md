# api.marioantunes.pt

Exemplo simples de API RESTful - NodeJS - Express - JWT - Prisma - MongoDB

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

abre outro terminal (rodar o studio para a base de dados, porta 5556):
```
npx prima studio
```

## schema.prisma

para subir o esquema/model USER
```
npx prisma db push 
```

instalar o cliente que vamos usar no server.js
```
npm install @prisma/client
```

para manipular a base de dados
```
npx prima studio
```
