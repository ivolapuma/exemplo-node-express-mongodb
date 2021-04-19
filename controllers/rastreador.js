const mongoose = require('mongoose');
const { Types: { ObjectId } } = require('mongoose');

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
        }

    }

    return RastreadorController;
}  
