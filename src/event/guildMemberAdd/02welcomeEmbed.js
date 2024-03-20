// at the top of your file
const { EmbedBuilder, Client, Interaction} = require('discord.js');

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
        .setAuthor({ name: 'FAP Softex', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
        .setDescription('Olá, você está no canal de verificação de ingressante. Execute o comando /verify e digite seu CPF no local indicado, para que possamos te dar acesso ao servidor.')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            { name: 'Dúvidas', value: 'Fale com a coordenação do curso.' },
            { name: '\u200B', value: '\u200B' },
        )
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({ text: 'SOFTEX Pernambuco, 2024', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        
        channel.send({ embeds: [welcomeEmbed]});
        
    } catch (error) {
        console.log(`Erro durante envio da embed de Boas-Vindas: ${error}`);
    }
    
}

