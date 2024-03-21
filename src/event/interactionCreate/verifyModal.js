const { Client, Interaction } = require('discord.js');

/**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */

module.exports = (client, interaction) => {

    if(!interaction.isButton()) return;
    interaction.deferReply({ ephemeral: true });

    const button = client.channels.cache.get(interaction.customId);

    if(!button) {
        interaction.reply({
            content: 'Elemento não encontrado.',
        });
        return;
    }

    
}



