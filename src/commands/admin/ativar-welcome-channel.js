const { ApplicationCommandOptionType, Interaction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const WelcomeChannelSchema = require('../../models/WelcomeChannel');

module.exports = {
  /**
   * 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {

    //criação da embed de boas-vindas
    const welcomeEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Seja Bem-Vindo(a)!')
    .setDescription('Olá! você está no canal de verificação do servidor SOFTEX LABS. Execute o comando /verificar e digite seu CPF no local indicado, para que possamos te dar pleno acesso.')
    .addFields(
        { name: 'Dúvidas?', value: 'Fale com a coordenação do curso.' },
        { name: '\u200B', value: '\u200B' },
    )
    .setTimestamp()
    .setFooter({ text: 'SOFTEX Pernambuco', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

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

      var welcomeChannel = await WelcomeChannelSchema.findOne({ guildId: interaction.guild.id, channelId: targetChannel.id});

      if (welcomeChannel) {
        //Checando no BD se há um registro com esse mesmo canal
        if (welcomeChannel.channelId === targetChannel.id) {
            interaction.editReply(`O canal ${targetChannel} já está configurado no modo 'Boas-Vindas'. Para desabilitar a função, execute "/desativar-welcome-channel"`);
            return;
          }
      } else {
         welcomeChannel = new WelcomeChannelSchema({
            guildId: interaction.guild.id,
            channelId: targetChannel.id,
        });
      }
      //Salvando alterações no BD
      await welcomeChannel.save();
      //Respondendo ao usuário
      interaction.editReply(`Canal ${targetChannel} configurado no modo 'Boas-Vindas' com sucesso! Para desabilitar a função, execute "/desativar-welcome-channel"`);

      //enviando a embed para o canal de boas-vindas
      targetChannel.send({ embeds: [welcomeEmbed], 
        components: [new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setLabel('verificar')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('welcomeButton'))]});

    } catch (error) {
        console.log(`Erro na execução do comando:\n${error}`);
    }

  },
  name: 'ativar-welcome-channel',
  description: 'Configura um canal de boas-vindas para este servidor.',
  devOnly: true,
  options: [
    {
      name: 'target-channel',
      description: 'O canal que você quer que sirva de boas-vindas neste servidor.',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

}
