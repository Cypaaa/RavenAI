const Error = require("../utils/error.js");
const { PermissionFlagsBits } = require("discord.js");
const VoiceChat = require("../utils/voicechat.js");
module.exports = {
    name: "Quit",
    description: "Quit the current voice chat",
    permissions: [PermissionFlagsBits.Speak],
    execute: (member, message, args) => {
        // get our vc and check if we are in the same vc as the user
        let connection = VoiceChat.GetVC(message.guildId);
        if (member.voice.channelId) {
            if (!connection) {
                message.reply(Error.SelfNotInVoiceChat);
            } else if (member.voice.channelId == VoiceChat.GetVCChanId(message.guildId)) {
                // then disconnect and clean our process object
                VoiceChat.DestroyVC(message.guildId)
            }
        } else {
            message.reply(Error.NotInVoiceChat);
        }
    }
};