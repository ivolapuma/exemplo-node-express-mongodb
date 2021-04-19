module.exports = (app) => {
    app.post('/rastreamento', app.controllers.rastreamento.cadastrar);
    app.get('/rastreamentos/:codigoRastreador', app.controllers.rastreamento.buscarPorRastreador);
}