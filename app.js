// configuracao do express
const express = require('express');
const app = express();

// configuracao do body-parser
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// para versoes do Express acima de 4.16, body-parser nao eh mais necessaio
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// configuracao da porta do servidor
app.listen(3000, () => {
    console.log('Servidor rodando, escutando a porta 3000');
});

// rotas
app.get('/', (request, response) => {
    response.send('Servidor rodando, tudo OK!');
});

app.post('/rastreador', (request, response) => {
    console.log('Chamado método POST para cadastrar rastreamento');
    console.log('request.body:');
    console.log(request.body);
    response.status(200).send('Chamado método POST para cadastrar rastreamento');
});