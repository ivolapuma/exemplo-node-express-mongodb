const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = (app) => {
    const UsuarioController = {

        cadastrar(request, response) {
            
            console.log('Chamado método POST para cadastrar rastreador');
            console.log('request.body:');
            console.log(request.body);

            mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

            const Usuario = app.models.usuario;

            Usuario.find({ login: request.body.login })
                .then((result) => {
                    if (result.length > 0) {
                        const mensagem = `Usuário já cadastrado`;
                        console.log(mensagem);
                        mongoose.disconnect();
                        response.status(400).send(mensagem);
                    } else {

                        const custoHash = 12;
                        bcrypt.hash(request.body.senha, custoHash)
                            .then((hash) => {
                                const usuario = new Usuario({
                                    login: request.body.login,
                                    senha: hash
                                });
                                console.log('usuario:');
                                console.log(usuario);
                                Usuario.create(usuario)
                                    .then((result) => {
                                        console.log(`Usuario cadastrado com sucesso`);
                                        mongoose.disconnect();
                                        response.status(200).send(result);
                                    })
                                    .catch((error) => {
                                        const mensagem = `Erro ao cadastrar usuario: ${error.message}`;
                                        console.log(mensagem);
                                        mongoose.disconnect();
                                        response.status(500).send(mensagem);                        
                                    });                        
                            })
                            .catch((error) => {
                                const mensagem = `Erro gerar hash da senha do usuário: ${error.message}`;
                                console.log(mensagem);
                                mongoose.disconnect();
                                response.status(500).send(mensagem);
                            });
                    }
                })
                .catch((error) => {
                    const mensagem = `Erro ao cadastrar usuario: ${error.message}`;
                    console.log(mensagem);
                    mongoose.disconnect();
                    response.status(500).send(mensagem);            
                });            
        }
    };
    return UsuarioController;
}