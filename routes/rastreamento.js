module.exports = (app) => {
    app.post('/rastreamento', app.controllers.rastreamento.cadastrar);
}