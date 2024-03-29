//sdf

require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');
const User = require('../models/Users');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
  ],
});

client.on('ready', async (c) => {

  // Atualize todos os documentos na coleção 'usuarios' adicionando o novo objeto à array 'cargos'
  User.updateMany(
    {},
    { $push: { cargos: { "1178520309264035972": "Residente new" } } }
  )
  .then(result => {
    console.log("Documentos atualizados com sucesso:", result);
  })
  .catch(error => {
    console.error("Erro ao atualizar documentos:", error);
  });
  process.exit();
});

client.login(process.env.TOKEN);