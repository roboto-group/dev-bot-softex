const { GuildMember, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const welcomeChannelSchema = require('../../models/WelcomeChannel');
/**
 * 
 * @param {Client} client 
 * @param {GuildMember} guildMember 
 */
module.exports = async (client, guildMember) => {
    
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
     
    try {
        if (guildMember.user.bot) return;

        const welcomeConfigs = await welcomeChannelSchema.find({
            guildId: guildMember.guild.id,   
        });

        if(!welcomeConfigs.length) return;

        for(const welcomeConfig of welcomeConfigs) {
            const targetChannel = guildMember.guild.channels.cache.get(
                welcomeConfig.channelId
            ) || (await guildMember.guild.channels.fetch(
                welcomeConfig.channelId
            ));

            if(!targetChannel) {
                welcomeChannelSchema.findOneAndDelete({
                    guildId: guildMember.guild.id,
                    channelId: welcomeConfig.channelId,
                }).catch(() => {});
            }

            const customMessage = welcomeConfig.customMessage || {content:'Acho que vi um novo membro do servidor...', ephemeral: true};

            const welcomeMessage = customMessage;
            
            targetChannel.send(welcomeMessage).catch(() => {});
        }
    } catch (error) {
        console.log(`Erro no envio do embed de boas-vindas:\n${error}`);
        
    }
}