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
  userName: {
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
    required: true
  }
})

module.exports = model('User', userSchema);