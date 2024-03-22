const { Client, Interaction, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

/**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */

module.exports = async (client, interaction) => {

    if(!interaction.isButton()) return;

    interaction.deferReply({ ephemeral: true });

    const button = interaction.customId;
    console.log(button);

    if(!button) {
        interaction.reply({
            content: 'Botão não encontrado.',
        });
        return;
    }

    //criando o modal
    const modal = new ModalBuilder()
    .setCustomId('verifyModal')
    .setTitle('Verificação de CPF');

    //criando o componente de input do CPF
    const cpfInput = new TextInputBuilder()
    .setCustomId('cpfInput')
    .setLabel('Digite o seu CPF abaixo:')
    .setStyle(TextInputStyle.Short)
    .setMaxLength(11)
    .setPlaceholder('Digite apenas números.')
    .setRequired(true);

    //precisa de um ActionRow pra cada input de texto
    const actionRow = new ActionRowBuilder().addComponents(cpfInput);

    //adicionando o input ao modal
    modal.addComponents(actionRow);

    //mostrando o modal ao usuário
    await interaction.showModal(modal);
   
}



