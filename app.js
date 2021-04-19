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

// configuracao do consign
const consign = require('consign');

consign()
  .include('models')
  .then('controllers')
  .then('routes')
  .into(app);

// configuracao da porta do servidor
app.listen(3000, () => {
    console.log('Servidor rodando, escutando a porta 3000');
});
