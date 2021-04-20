const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// resolver isso depois com variáveis de ambiente
const CHAVE_JWT = 'f2fcab389bfad09a77499ebee79f6a9dbf084b770a6d3bc713825942c34285f008bb214e8504e84d2ebd909578e47438669724016848863ecccd8b84ed82f1ca';

module.exports = (app) => {

    const RastreadorController = {

        cadastrar(request, response) {

            console.log('Chamado método POST para cadastrar rastreador');
            console.log('request.body:');
            console.log(request.body);
            console.log('token:');
            console.log(request.headers.authorization);

            try {

                const token = request.headers.authorization;
                const payload = jwt.verify(token, CHAVE_JWT);
                console.log('payload:');
                console.log(payload);

                mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

                const Usuario = app.models.usuario;
                const Rastreador = app.models.rastreador;

                Usuario.find({ login: payload.login })
                    .then((result) => {
                        if (result.length === 0) {
                            const mensagem = `Erro ao verificar token: token inválido`;
                            console.log(mensagem);
                            mongoose.disconnect();
                            response.status(401).send(mensagem);    
                        } else {
                            const rastreador = new Rastreador(request.body);
                            Rastreador.create(rastreador)
                                .then((result) => {
                                    console.log(`Rastreador ${rastreador.codigoRastreador} cadastrado com sucesso`);
                                    mongoose.disconnect();
                                    response.status(200).send(result);
                                })
                                .catch((error) => {
                                    const mensagem = `Erro ao cadastrar o rastreador: ${error.message}`;
                                    console.log(mensagem);
                                    mongoose.disconnect();
                                    response.status(500).send(mensagem);
                                });    
                        }
                    })
                    .catch((error) => {
                        const mensagem = `Erro ao verificar token: ${error.message}`;
                        console.log(mensagem);
                        mongoose.disconnect();
                        response.status(401).send(mensagem);
                    });

            } catch(error) {
                console.log(`Erro ao verificar token: ${error.message}`);
                response.status(401).send(`Erro ao verificar token: ${error.message}`);
            }
        },

        alterar(request, response) {

            console.log('Chamado método PUT para alterar dados de um rastreador');
            console.log('request.body:');
            console.log(request.body);

            const Rastreador = app.models.rastreador;
            
            mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

            const where = {
                codigoRastreador: request.body.codigoRastreador
            };

            const set = { 
                $set: {
                    placaVeiculo: request.body.placaVeiculo,
                    cpfCliente: request.body.cpfCliente
                }
            };

            Rastreador.updateOne(where, set)
                .then((result) => {
                    if (result && result.ok && result.n) {
                        const mensagem = `Dados do rastreador ${where.codigoRastreador} alterados com sucesso`;
                        console.log(mensagem);
                        mongoose.disconnect();
                        response.status(200).send(mensagem);
                    } else {
                        const mensagem = `codigoRastreador nao localizado`;
                        console.log(mensagem);
                        mongoose.disconnect();
                        response.status(404).send(mensagem);
                    }
                })
                .catch((error) => {
                    const mensagem = `Erro ao atualizar os dados do rastreador: ${error.message}`;
                    console.log(mensagem);
                    mongoose.disconnect();
                    response.status(500).send(mensagem);            
                });
        },

        remover(request, response) {

            console.log('Chamado método DELETE para excluir os registros de um rastreador');
            console.log('request.params:');
            console.log(request.params);

            const Rastreador = app.models.rastreador;
            const Rastreamento = app.models.rastreamento;

            mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

            const where = {
                codigoRastreador: request.params.codigoRastreador
            };

            Rastreador.find(where)
                .then((result) => {

                    console.log('result:');
                    console.log(result);

                    if (result.length === 0) {
                        console.log(`Rastreador ${where.codigoRastreador} não localizado`);
                        mongoose.disconnect();
                        response.status(404).send(`Rastreador ${where.codigoRastreador} não localizado`);
                    } else {

                        Rastreamento.deleteMany(where)
                            .then((result) => {

                                console.log(`Rastreador ${where.codigoRastreador} | remoção dos registros de rastreamento ok:${result.ok} | quantidade de registros:${result.deletedCount}`);

                                Rastreador.deleteOne(where)
                                    .then((result) => {
                                        console.log('rastreador remove result:');
                                        console.log(result);                    
                                        mongoose.disconnect();
                                        response.status(200).send(`Registros do rastreador ${where.codigoRastreador} removidos com sucesso`);
                                    })
                                    .catch((error) => {
                                        console.log(`Erro ao remover o rastreador: ${error.message}`)
                                        mongoose.disconnect();
                                        response.status(500).send(`Erro ao remover o rastreador: ${error.message}`);
                                    });

                            })
                            .catch((error) => {
                                console.log(`Erro ao remover os registros de rastreamento do rastreador: ${error.message}`)
                                mongoose.disconnect();
                                response.status(500).send(`Erro ao remover os registros de rastreamento do rastreador: ${error.message}`);
                            });

                    }
                })
                .catch((error) => {
                    console.log(`Erro ao localizar o rastreador: ${error.message}`)
                    mongoose.disconnect();
                    response.status(500).send(`Erro ao localizar o rastreador: ${error.message}`);
                });        
        }

    }

    return RastreadorController;
}  
