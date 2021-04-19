const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    const Schema = mongoose.Schema;
    const rastreadorSchema = Schema({
        codigoRastreador: { type: String, required: true, index: { unique: true } },
        placaVeiculo: { type: String, required: true },
        cpfCliente: { type: String, required: true }
    });
    const Rastreador = mongoose.model('rastreadores', rastreadorSchema);
    mongoose.disconnect();    
    return Rastreador;
}
