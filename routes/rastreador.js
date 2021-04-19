module.exports = (app) => {

    // rotas
    app.get('/', (request, response) => {
        response.send('Servidor rodando, tudo OK!');
    });

    app.post('/rastreador', app.controllers.rastreador.cadastrar);

}