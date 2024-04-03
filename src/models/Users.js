const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: {
    type: String,
    required: false,
  },
  guildId: {
    type: String,
    required: false,
  },
  nome: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  curso: {
    type: String,
    required: true,
  },
  turno: {
    type: String,
    required: true,
  },
  cargos: {
    type: Array,
    required: true,
  },
  dataValidacao: {
    type: Date,
    required: false,
  },
})

module.exports = model('User', userSchema);