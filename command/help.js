const { PermissionFlagsBits } = require("discord.js");
module.exports = {
    name: "Help",
    description: "Send the description of every command",
    permissions: [PermissionFlagsBits.Speak],
    execute: (member, message, args) => {
        let msg = "";
        Object.values(process.discord.commands).forEach(command => {
            msg += `${process.env.DISCORD_PREFIX}${command.name} - ${command.description}\n`
        });
        message.channel.send(msg);
    }
};