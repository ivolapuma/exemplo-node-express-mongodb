const mongoose = require('mongoose');

module.exports = (app) => {

    const RastreadorController = {

        cadastrar(request, response) {

            console.log('Chamado método POST para cadastrar rastreamento');
            console.log('request.body:');
            console.log(request.body);
    
            const Rastreador = app.models.rastreador;
            
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
        }
    }

    return RastreadorController;
}  
