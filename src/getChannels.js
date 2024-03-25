//Lista o nome e ID dos canais do servidor

require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
  ],
});

client.on('ready', async (c) => {
    try {
      const channelList = {};
      let channels = client.channels.cache;
        for (const channel of channels.values()) {
          channelList[channel.id] = channel.name;
        }
      console.log(channelList);
      process.exit();
    } catch (error) {
      console.log(error);
    }
});

client.login(process.env.TOKEN);