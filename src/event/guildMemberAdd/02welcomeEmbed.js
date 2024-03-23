// at the top of your file
const { EmbedBuilder, Client, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder } = require('discord.js');

module.exports = (client, interaction) => {
    try {
        //pegando o ID do canal de verificação
        const channel = client.channels.cache.get('1194645892607783034');
    
        //testando se o evento está ocorrendo no canal, para que o código seja executado ou não
        if(!channel) return;
    
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
        
        channel.send({ embeds: [welcomeEmbed], 
            components: [new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setLabel('verificar')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId('welcomeButton'))]});
        
    } catch (error) {
        console.log(`Erro durante o procedimento de boas-vindas: ${error}`);
    }
    
}

