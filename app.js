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


// configuracao do mongoose
const mongoose = require('mongoose');
// definindo modelo do banco MongoDB
// via aplicacao, vamos criar a coleção no mongodb...
mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const Schema = mongoose.Schema;
const rastreadorSchema = Schema({
    codigoRastreador: { type: String, required: true, index: { unique: true } },
    placaVeiculo: { type: String, required: true },
    cpfCliente: { type: String, required: true }
});
const Rastreador = mongoose.model('rastreadores', rastreadorSchema);
mongoose.disconnect();


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

    // cadastro do rastreador
    mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    const rastreador = new Rastreador(request.body);
    rastreador.save(
        (error, result) => {
            if (error) {
                console.log(`Erro ao cadastrar o rastreador: ${error.message}`);
                mongoose.disconnect();
                response.status(500).send(`Erro ao cadastrar o rastreador: ${error.message}`);
            } else {
                console.log(`Rastreador ${rastreador.codigoRastreador} cadastrado no banco`);
                mongoose.disconnect();
                response.status(200).send(result);
            }
        }
    );
});