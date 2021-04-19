const mongoose = require('mongoose');

module.exports = (app) => {

    const RastreadorController = {

        cadastrar(request, response) {

            console.log('Chamado método POST para cadastrar rastreador');
            console.log('request.body:');
            console.log(request.body);
    
            const Rastreador = app.models.rastreador;
            
            mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
            
            const rastreador = new Rastreador(request.body);
            rastreador.save(
                (error, result) => {
                    if (error) {
                        const mensagem = `Erro ao cadastrar o rastreador: ${error.message}`;
                        console.log(mensagem);
                        mongoose.disconnect();
                        response.status(500).send(mensagem);
                    } else {
                        console.log(`Rastreador ${rastreador.codigoRastreador} cadastrado com sucesso`);
                        mongoose.disconnect();
                        response.status(200).send(result);
                    }
                }
            );            
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
