module.exports = (app) => {
    app.post('/usuario', app.controllers.usuario.cadastrar);
}