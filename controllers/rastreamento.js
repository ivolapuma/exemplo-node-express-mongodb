const mongoose = require('mongoose');

module.exports = (app) => {

    const RastreamentoController = {

        cadastrar(request, response) {

            console.log('Chamado método POST para cadastrar rastreamento de um veiculo');
            console.log('request.body:');
            console.log(request.body);
    
            const Rastreador = app.models.rastreador;
            const Rastreamento = app.models.rastreamento;
            
            mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

            const where = {
                codigoRastreador: request.body.codigoRastreador
            };

            Rastreador.find(where)
                .then((result) => {
                    if (result.length === 0) {
                        const mensagem = `codigoRastreador ${where.codigoRastreador} não localizado`;
                        console.log(mensagem);
                        mongoose.disconnect();
                        response.status(404).send(mensagem);
                    } else {
                        const rastreamento = new Rastreamento(request.body);
                        if (!rastreamento.dataHora) {
                            rastreamento.dataHora = new Date;
                        }
                        rastreamento.save()
                            .then((result) => {
                                console.log(`Rastreamento do veiculo de codigoRastreador ${rastreamento.codigoRastreador} cadastrado com sucesso`);
                                mongoose.disconnect();
                                response.status(200).send(result);
                            })
                            .catch((error) => {
                                const mensagem = `Erro ao cadastrar rastreamento: ${error.message}`;
                                console.log(mensagem);
                                mongoose.disconnect();
                                response.status(500).send(mensagem);
                            });
                    }
                })
                .catch((error) => {
                    const mensagem = `Erro ao localizar o codigoRastreador: ${error.message}`;
                    console.log(mensagem);
                    mongoose.disconnect();
                    response.status(500).send(mensagem);
                });
        },

        buscarPorRastreador(request, response) {

            console.log('Chamado método GET para buscar rastreamentos de um veiculo');
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
                    if (result.length === 0) {
                        const mensagem = `codigoRastreador ${where.codigoRastreador} não localizado`;
                        console.log(mensagem);
                        mongoose.disconnect();
                        response.status(404).send(mensagem);
                    } else {
                        Rastreamento.find(where)
                            .then((result) => {
                                console.log(`Rastreamentos do veiculo de codigoRastreador retornados com sucesso`);
                                mongoose.disconnect();
                                response.status(200).send(result);
                            })
                            .catch((error) => {
                                const mensagem = `Erro ao buscar os rastreamentos do codigoRastreador: ${error.message}`;
                                console.log(mensagem);
                                mongoose.disconnect();
                                response.status(500).send(mensagem);
                            });
                    }
                })
                .catch((error) => {
                    const mensagem = `Erro ao localizar o codigoRastreador: ${error.message}`;
                    console.log(mensagem);
                    mongoose.disconnect();
                    response.status(500).send(mensagem);
                });
        }
    }

    return RastreamentoController;
}  
