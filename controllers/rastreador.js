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
        }
    }

    return RastreadorController;
}  
