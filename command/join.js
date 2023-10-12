const { joinVoiceChannel } = require("@discordjs/voice");
const { PermissionFlagsBits } = require("discord.js");
const VoiceChat = require("../utils/voicechat.js");
const ChatGPT = require("../utils/chatgpt.js");
const WitAI = require("../utils/witai.js");
const Error = require("../utils/error.js");
module.exports = {
    name: "Join",
    description: "Join the voice chat to discuss with ppl",
    permissions: [PermissionFlagsBits.Speak],
    execute: (member, message, args) => {
        // get the voiceconnection in case we are already in a voicechats
        let connection = VoiceChat.GetVC(message.guildId);

        if (member.voice.channelId) {
            // no voicechat
            if (!connection) {
                // join the voicechat and store it in our process object
                VoiceChat.SaveVC(joinVoiceChannel({
                    channelId: member.voice.channelId,
                    guildId: message.guildId,
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: false,
                    selfMute: false,
                }));

                // for every member of the voicechat if not a bot
                member.voice.channel.members.forEach(vcMember => {
                    if (!vcMember.user.bot) {
                        // subscribe to it's audio output
                        VoiceChat.Subscribe(vcMember, (audioStream, duration) => {
                            // translate it using WitAI and send a callback to handle the output
                            WitAI.Transcribe(audioStream, async (output) => {
                                // check if the output is longer than 0 caracters
                                // and starts with our trigger words
                                // and is longer than 0 caracter when removing the trigger words
                                if (output.text.length > 0) {
                                    console.log("duration: " + duration);
                                    console.log(output.text);
                                    if (output.text.startsWith(process.env.OPENAI_TRIGGER_WORDS)) {
                                        let prompt = output.text.slice(process.env.OPENAI_TRIGGER_WORDS.length +1);
                                        let toReplyPromise = message.channel.send("__" + prompt + ":__ (*loading*)");
                                        if (prompt.length > 0) {
                                            // ask chat gpt 3.5-turbo to answer our question
                                            ChatGPT.Ask(prompt, (choices) => {
                                                toReplyPromise.then(toReply => toReply.reply("``"+choices[0].message.content+"``"));
                                            });
                                        }
                                    }
                                }
                            });
                        });
                    }
                });
                // voicechat but wrong one
            } else if (member.voice.channelId != VoiceChat.GetVCChanId(message.guildId)) {
                message.reply(Error.NotInSameVoiceChat);
                // voicechat and the same
            } else {
                message.reply(Error.AlreadyInVoiceChat);
            }
            // user no voicechat
        } else {
            message.reply(Error.NotInVoiceChat);
        }
    }
};