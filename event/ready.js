const { getVoiceConnection } = require("@discordjs/voice");
const VoiceChat = require("../utils/voicechat.js");
module.exports = (client, e) => {
    // When ready fetch all guild in case we are in a voice chat already
    client.guilds.fetch().then(guilds => {
        guilds.forEach(guild => {
            // then get our connection and save it to our object in process
            let connection = getVoiceConnection(guild.id)
            if (connection) {
                VoiceChat.SaveVC(connection);
            }
        });
    })
    console.log(`Ready! Logged in as ${client.user.tag}`);
};