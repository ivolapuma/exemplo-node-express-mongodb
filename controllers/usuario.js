const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CUSTO_HASH = 12;
const TEMPO_EXPIRACAO_TOKEN = '5m';
const CHAVE_JWT = 'f2fcab389bfad09a77499ebee79f6a9dbf084b770a6d3bc713825942c34285f008bb214e8504e84d2ebd909578e47438669724016848863ecccd8b84ed82f1ca';


module.exports = (app) => {
    const UsuarioController = {

        cadastrar(request, response) {
            
            console.log('Chamado método POST para cadastrar usuário');
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
                        const senhaHash = bcrypt.hashSync(request.body.senha, CUSTO_HASH);
                        const usuario = new Usuario({
                            login: request.body.login,
                            senha: senhaHash
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
                    }
                })
                .catch((error) => {
                    const mensagem = `Erro ao cadastrar usuario: ${error.message}`;
                    console.log(mensagem);
                    mongoose.disconnect();
                    response.status(500).send(mensagem);            
                });            
        },

        login(request, response) {

            console.log('Chamado método POST para fazer login');
            console.log('request.body:');
            console.log(request.body);

            mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

            const Usuario = app.models.usuario;

            Usuario.find({ login: request.body.login })
                .then((result) => {
                    if (result.length === 0) {
                        console.log('login/senha nao cadastrados');
                        mongoose.disconnect();
                        response.status(401).send('Usuário ou senha estão incorretos')
                    } else {

                        const usuario = new Usuario(result[0]);
                        const senha = request.body.senha;
                        const senhaHash = usuario.senha;
                        const senhaValida = bcrypt.compareSync(senha, senhaHash);

                        const payload = { login: request.body.login };
                        const token = jwt.sign(payload, CHAVE_JWT, { expiresIn: TEMPO_EXPIRACAO_TOKEN });

                        mongoose.disconnect();
                        console.log('token:');
                        console.log(token);
                        response.set('Authorization', token);
                        response.status(200).send(`Usuário logado com sucesso: ${token}`);
                    }
                })
                .catch((error) => {
                    const mensagem = `Erro ao fazer login: ${error.message}`;
                    console.log(mensagem);
                    mongoose.disconnect();
                    response.status(500).send(mensagem);
                });

        }
    };
    return UsuarioController;
}