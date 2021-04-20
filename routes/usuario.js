module.exports = (app) => {
    app.post('/usuario', app.controllers.usuario.cadastrar);
    app.post('/login', app.controllers.usuario.login);
}