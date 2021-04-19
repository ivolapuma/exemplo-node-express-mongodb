const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://localhost:27017/carlog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    const Schema = mongoose.Schema;
    const rastreamentoSchema = Schema({
        codigoRastreador: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        dataHora: { type: Date, required: true }
    });
    const Rastreamento = mongoose.model('rastreamentos', rastreamentoSchema);
    mongoose.disconnect();    
    return Rastreamento;
}
