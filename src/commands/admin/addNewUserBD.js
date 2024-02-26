const { ApplicationCommandOptionType } = require("discord.js");


module.exports = {
  name: 'addnewuser',
  description: 'Adiciona novo usuario no banco de dados.',
  ephemeral: true,
  devOnly: true,
  testOnly: true,

  options: [
    {
      name: 'cpf',
      description: 'CPF do novo usuário.',
      type: ApplicationCommandOptionType.String,

    }
  ],

  callback: () => {
    user = new User({
      ...query,
      userId: interaction.user.id,
      guildId: interaction.guild.id,
      balance: 0,
      lastDaily: new Date(), //data atual
      curso: 'backend',

    })
      
  },
}