const { Client, Interaction, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const wellCome = require('../../commands/moderation/wellCome');

module.exports = (client, interaction) => {
    try {
        //pegando o ID do canal de verificação
        const channel = client.channels.cache.get('1194645892607783034');
    
        //testando se o evento está ocorrendo no canal, para que o código seja executado ou não
        if(!channel) return;

        //criação do botão de verificação
        const row = new ActionRowBuilder();

        row.components.push(
            new ButtonBuilder()
            .setLabel('verificar')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('welcomeButton')
        )

        channel.send({
            components: [row],
        })
        
    } catch (error) {
        console.log(`Erro ao executar o botão: ${error}`);
    }
}