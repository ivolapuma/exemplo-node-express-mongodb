const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    const Schema = mongoose.Schema;
    const usuarioSchema = Schema({
        login: { type: String, required: true, index: { unique: true } },
        senha: { type: String, required: true }
    });
    const Usuario = mongoose.model('usuarios', usuarioSchema);
    mongoose.disconnect();    
    return Usuario;
}
