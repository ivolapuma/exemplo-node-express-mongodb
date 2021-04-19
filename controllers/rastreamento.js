const mongoose = require('mongoose');

module.exports = (app) => {

    const RastreamentoController = {

        async cadastrar(request, response) {

            console.log('Chamado método POST para cadastrar rastreamento de um veiculo');
            console.log('request.body:');
            console.log(request.body);
    
            const Rastreador = app.models.rastreador;
            const Rastreamento = app.models.rastreamento;
            
            mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

            const where = {
                codigoRastreador: request.body.codigoRastreador
            };
            const result = await Rastreador.find(
                where,
                (error, result) => {
                    if (error) {
                        const mensagem = `Erro ao localizar o codigoRastreador: ${error.message}`;
                        console.log(mensagem);
                        response.status(500).send(mensagem);
                    } else if (result.length === 0) {
                        const mensagem = `codigoRastreador ${where.codigoRastreador} não localizado`;
                        console.log(mensagem);
                        response.status(404).send(mensagem);
                    } else {
                        return result;
                    }
                }
            );

            const rastreador = new Rastreador(result[0]);
            console.log('codigoRastreador localizado com sucesso')
            console.log(rastreador);
            
            const rastreamento = new Rastreamento(request.body);
            if (!rastreamento.dataHora) {
                rastreamento.dataHora = new Date;
            }
            rastreamento.save(
                (error, result) => {
                    if (error) {
                        const mensagem = `Erro ao cadastrar rastreamento: ${error.message}`;
                        console.log(mensagem);
                        mongoose.disconnect();
                        response.status(500).send(mensagem);
                    } else {
                        console.log(`Rastreamento do veiculo de codigoRastreador ${rastreamento.codigoRastreador} cadastrado com sucesso`);
                        mongoose.disconnect();
                        response.status(200).send(result);
                    }
                }
            );            
        }
    }

    return RastreamentoController;
}  
