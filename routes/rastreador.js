module.exports = (app) => {
    app.post('/rastreador', app.controllers.rastreador.cadastrar);
    app.put('/rastreador', app.controllers.rastreador.alterar);
}