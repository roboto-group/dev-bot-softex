const { Schema, model } = require('mongoose');

const welcomeChannelSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        //unique: true, //limita a apenas um canal do servidor
    },
    channelId: {
        type: String,
        required: true,
        unique: true,
    },
    customMessage: {
        type: String,
        default: null,
    }
}, 
{ timestamps: true }
);

module.exports = model('WelcomeChannel', welcomeChannelSchema);