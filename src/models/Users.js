const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
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
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
})

module.exports = model('User', userSchema);