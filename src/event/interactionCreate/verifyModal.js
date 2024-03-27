const { ModalSubmitInteraction, Client, Interaction, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
/**
 * 
 * @param {Client} client 
 * @param {ModalSubmitInteraction} interaction 
 * @returns 
 */
module.exports = async (client, interaction) => {

    if(!interaction.isButton()) return;

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

    //esperando o modal ser submetido
    const filter = (interaction) => interaction.customId === 'verifyModal';


    interaction
        .awaitModalSubmit({ filter, time: 30_000})
        .then((modalInteraction) => {
            const cpfValue = modalInteraction.fields.getTextInputValue('cpfInput');

            modalInteraction.reply(`Seu cpf é '${cpfValue}' hohohohoho`)
        });
}


