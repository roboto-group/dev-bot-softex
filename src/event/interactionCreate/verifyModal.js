const { ModalSubmitInteraction, Client, Interaction, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

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

    if(!interaction.isModalSubmit()) return;

    if (interaction.customId === 'verifyModal') {
		await interaction.update({ content: 'Your submission was received successfully!' });
	}

    // Get the data entered by the user
	const cpfValue = interaction.fields.getTextInputValue('cpfInput');
	console.log({ cpfValue });
}


