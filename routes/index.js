module.exports = (app) => {
    app.get('/', (request, response) => {
        response.send('Servidor rodando, tudo OK!');
    });
}