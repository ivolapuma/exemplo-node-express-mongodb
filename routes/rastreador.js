module.exports = (app) => {
    app.post('/rastreador', app.controllers.rastreador.cadastrar);
    app.put('/rastreador', app.controllers.rastreador.alterar);
    app.delete('/rastreador/:codigoRastreador', app.controllers.rastreador.remover);
}