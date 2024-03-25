require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder} = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', async (c) => {
  try {
     const channel = await client.channels.cache.get(process.env.chanel_libcargo);
     if (!channel) return;
 
      const embed = new EmbedBuilder()
        .setTitle('COMUNICADO')
        .setDescription(`Olá Residentes!\nPara ter acesso ao canal de bolsistas, é necessário fazer a validação do usuário com nosso banco de dados.\nDigite o comando **/validar** e informe seu CPF.`)
        .setColor('Blurple')

      await channel.send({
        embeds: [embed]
      });
    process.exit();
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.TOKEN);