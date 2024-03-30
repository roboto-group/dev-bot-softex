const { ApplicationCommandOptionType, Interaction, PermissionFlagsBits } = require('discord.js');
const WelcomeChannelSchema = require('../../models/WelcomeChannel');

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {

    //Checando se o comando foi executado em um servidor
    if (!interaction.inGuild()) {
        interaction.reply({
          content: 'Este comando só pode ser executado de um servidor.'
        })
        return;
      }

    const targetChannel = interaction.options.getChannel('target-channel');
    try {
      await interaction.deferReply({ephemeral: true});
      //vamos verificar se existe um documento com esse guildId no BD
      if (!(await WelcomeChannelSchema.exists({ guildId: interaction.guild.id, channelId: targetChannel.id}))) {
        interaction.editReply(`Nenhum canal está ativado com o modo 'Boas-Vindas' neste servidor.\nExecute "/ativar-welcome-channel" para configurar a função.`);
        return;
      }
      //caso exista o match, faremos a exclusão
      await WelcomeChannelSchema.findOneAndDelete({ guildId: interaction.guild.id, channelId: targetChannel.id});
      //resposta para o usuário
      interaction.editReply(`O canal ${targetChannel} foi desabilitado do modo 'Boas-Vindas'. Execute "/ativar-welcome-channel" para configurar este ou outro canal novamente.`);

    } catch (error) {
      console.log(`Erro ao desabilitar o modo 'Boas-Vindas': ${error}`);
    }
  },
  name: 'desativar-welcome-channel',
  description: "Desabilita o modo 'Boas-Vindas' de um canal deste servidor.",
  devOnly: true,
  options: [
    {
      name: 'target-channel',
      description: "O canal que você quer desativar o modo 'Boas-Vindas'.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
}