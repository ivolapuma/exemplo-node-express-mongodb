module.exports = (app) => {
    app.post('/rastreador', app.controllers.rastreador.cadastrar);
}