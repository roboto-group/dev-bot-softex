const { ModalSubmitInteraction, Client, Interaction, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const User = require('../../models/Users');
/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 * @returns 
 */

//variáveis globais que armazenará o cpf, nome e email digitado pelo membro recém-chegado
let cpfValue;
let nameValue;
let emailValue;
//variável global que armazenará o objeto da interação de sumbissão de modal
let interactionModal;

module.exports = async (client, interaction) => {

    if(interaction.isButton()) {

        if(interaction.customId === 'cadastroButton') {
            //criando o modal
            const cadastroModal = new ModalBuilder()
            .setCustomId('cadastroModal')
            .setTitle('Cadastro');

            //criando os componentes de input do modal
            const cpfInput = new TextInputBuilder()
            .setCustomId('cpfInput')
            .setLabel('Digite o seu CPF abaixo:')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(15)
            .setPlaceholder('Digite apenas números.')
            .setRequired(true);

            const nameInput = new TextInputBuilder()
            .setCustomId('nameInput')
            .setLabel('Digite o seu NOME COMPLETO abaixo:')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(50)
            .setPlaceholder('EX: HERALDO DO MONTE')
            .setRequired(true);

            const emailInput = new TextInputBuilder()
            .setCustomId('emailInput')
            .setLabel('Digite o seu E-MAIL abaixo:')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(30)
            .setPlaceholder('EX: heraldomonte@email.com')
            .setRequired(true);

            //precisa de um ActionRow pra cada input de texto
            const actionRow = new ActionRowBuilder().addComponents(cpfInput);
            const actionRow2 = new ActionRowBuilder().addComponents(nameInput);
            const actionRow3 = new ActionRowBuilder().addComponents(emailInput);

            //adicionando o input ao modal
            cadastroModal.addComponents(actionRow, actionRow2, actionRow3);

            //mostrando o modal ao usuário
            await interaction.showModal(cadastroModal);

            //esperando o modal ser submetido
            const filter = (interaction) => interaction.customId === 'cadastroModal';

            const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 30_000 });

            if (modalInteraction) {
                cpfValue = modalInteraction.fields.getTextInputValue('cpfInput');
                nameValue = modalInteraction.fields.getTextInputValue('nameInput');
                emailValue = modalInteraction.fields.getTextInputValue('emailInput');
                interactionModal = modalInteraction;

            //await modalInteraction.editReply(`Os dados conferem?\nCPF: ${cpfValue}\nNOME: ${nameValue}\nE-MAIL: ${emailValue}`);
            }

            }
    }
}