//Lista o nome e ID dos cargos do servidor

require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
  ],
});

client.on('ready', () => {
  client.guilds.cache.forEach(guild => {
    const roles = guild.roles.cache.map(role =>  ({ [role.id]: role.name }));
    console.log(roles)
  });
  process.exit();
});

client.login(process.env.TOKEN);