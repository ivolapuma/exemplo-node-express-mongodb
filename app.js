// configuracao do express
const express = require('express');

const app = express();

app.listen(3000, () => {
    console.log('Servidor rodando, escutando a porta 3000');
});

// criando 1a rota
app.get('/', (request, response) => {
    response.send('Servidor rodando, tudo OK!');
});